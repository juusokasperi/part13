const { Sequelize } = require('sequelize');
const { DATABASE_URL } = require('./config');
const { Umzug, SequelizeStorage } = require('umzug');
const logger = require('./logger');

const sequelize = new Sequelize(DATABASE_URL);

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
  logger.info('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  });
};

const rollbackMigration = async () => {
  await sequelize.authenticate();
  const migrator = new Umzug(migrationConf);
  await migrator.down();
}

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await runMigrations();
    logger.info('Connect to database');
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    logger.error('Failed to connect to database');
    return process.exit(1);
  }
  return null;
};

module.exports = { connectToDatabase, sequelize, rollbackMigration };
