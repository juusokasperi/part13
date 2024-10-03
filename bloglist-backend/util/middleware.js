const logger = require('./logger');

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method);
  logger.info('Path:', request.path);
  logger.info('Body:', request.body);
  logger.info('---');
  next();
};

// eslint-disable-next-line no-unused-vars
const unknownEndPoint = (request, response) => {
  return response.status(404).send({ error: 'Unknown endpoint' });
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, request, response, next) => {
  logger.error(error.message);
  if (error.message === 'invalid id')
    return response.status(400).send({ error: 'Invalid blog id' });
  if (error.name === 'SequelizeValidationError') {
    const formattedErrors = {};
    error.errors.forEach(err => {
      formattedErrors[err.path] = err.message;
    });
    return response.status(400).json({ error: formattedErrors });
  }
  next(error);
};

module.exports = {
  requestLogger,
  unknownEndPoint,
  errorHandler
};
