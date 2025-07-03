import { Sequelize, QueryInterface } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';
import { pathToFileURL } from 'url';
import logger from './logger.js';

import {
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,
  DB_HOST,
} from './config.js';

const isTestEnv = process.env.NODE_ENV === 'test';
const port = isTestEnv ? 3307 : 3306;
logger.info(
  'mysql_database:',
  MYSQL_DATABASE,
  'mysql_user:',
  MYSQL_USER,
  'db_host:',
  DB_HOST,
  'port:',
  String(port),
);

export const sequelize: Sequelize = new Sequelize(
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,
  {
    host: DB_HOST,
    dialect: 'mysql',
    port: port, // Use different port for test environment
    logging: false,
  },
);

const isDevEnv = process.env.NODE_ENV === 'development';
const glob = isTestEnv || isDevEnv ? 'src/migrations/*.ts' : 'migrations/*.js';

import path from 'path';

const migrationConf = {
  migrations: {
    glob: glob,
    resolve: ({
      path: filePath,
      context,
    }: {
      path?: string;
      context: QueryInterface;
    }) => {
      if (!filePath) {
        throw new Error('Migration path is undefined');
      }
      // Use dynamic import for loading migration modules
      const migrationPromise = import(pathToFileURL(filePath).href);
      return {
        name: path.basename(filePath),
        up: async () => (await migrationPromise).up({ context }),
        down: async () => (await migrationPromise).down({ context }),
      };
    },
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  logger: console,
};

export const runMigrations = async (): Promise<void> => {
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

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const connectToDatabase = async (
  maxRetries = 10,
  retryDelayMs = 2000,
): Promise<void> => {
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      await sequelize.authenticate();
      await runMigrations();
      logger.info('database connected');
      return;
    } catch (error: unknown) {
      attempt++;
      logger.error(`Database connection attempt ${attempt} failed.`);
      if (attempt >= maxRetries) {
        logger.error('connecting database failed', String(error));
        if (process.env.NODE_ENV !== 'test') {
          process.exit(1);
        } else {
          throw error;
        }
      } else {
        await wait(retryDelayMs);
      }
    }
  }
};
