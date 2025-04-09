const Sequelize = require('sequelize');
const { Umzug, SequelizeStorage } = require('umzug');

const {
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
  DB_HOST,
} = require('./config');

const sequelize = new Sequelize(MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, {
  host: DB_HOST,
  dialect: 'mysql',
  port: 3306,
  logging: false,
});

const migrationConf = {
  migrations: {
    glob: 'migrations/*.js',
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console,
};
const runMigrations = async () => {
  const migrator = new Umzug(migrationConf);
  const migrations = await migrator.up();
  console.warn('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  });
};
const rollbackMigration = async () => {
  await sequelize.authenticate();
  const migrator = new Umzug(migrationConf);
  await migrator.down();
};

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await runMigrations();
    console.warn('database connected');
  } catch (err) {
    console.error('connecting database failed', err.message);
    return process.exit(1);
  }

  return null;
};

module.exports = { connectToDatabase, sequelize, rollbackMigration };
