import { Sequelize } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';
import logger from './logger.js';

import {
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,
  DB_HOST,
} from './config.js';

export const sequelize: Sequelize = new Sequelize(
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,
  {
    host: DB_HOST,
    dialect: 'mysql',
    port: 3306,
    logging: false,
  },
);

const migrationConf = {
  migrations: {
    glob: 'buildBackend/migrations/*.js',
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  logger: console,
};

const runMigrations = async (): Promise<void> => {
  try {
    const migrator = new Umzug(migrationConf);
    const migrations = await migrator.up();

    if (migrations.length === 0) {
      logger.info('No new migrations to run. Database schema is up to date.');
    } else {
      logger.info(
        `Migrations executed: ${migrations.map((mig) => mig.name).join(', ')}`,
      );
    }
  } catch (error) {
    logger.error(
      'Migration failed',
      error instanceof Error ? error.message : String(error),
    );
    throw error;
  }
};

export const rollbackMigration = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    const migrator = new Umzug(migrationConf);
    const migration = await migrator.down();

    if (!migration) {
      logger.info(
        'No migration was rolled back. Database is at base state or already at previous step.',
      );
    } else if (Array.isArray(migration)) {
      logger.info(
        `Rolled back migrations: ${migration.map((m) => m.name).join(', ')}`,
      );
    }
  } catch (error) {
    logger.error(
      'Rolling back migration failed',
      error instanceof Error ? error.message : String(error),
    );
  }
};

export const connectToDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    await runMigrations();
    logger.info('database connected');
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error('connecting database failed', error.message);
    } else {
      logger.error('connecting database failed', 'Unknown error');
    }

    process.exit(1);
  }
};
