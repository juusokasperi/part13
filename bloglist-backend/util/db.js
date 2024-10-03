const { Sequelize } = require('sequelize');
const { DATABASE_URL } = require('./config');
const logger = require('./logger');

const sequelize = new Sequelize(DATABASE_URL);

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Connect to database');
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    logger.error('Failed to connect to database');
    return process.exit(1);
  }
  return null;
};

module.exports = { connectToDatabase, sequelize };
