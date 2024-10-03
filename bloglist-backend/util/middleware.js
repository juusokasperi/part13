const logger = require('./logger');

const unknownEndPoint = (response) => {
  response.status(404).send({ error: 'Unknown endpoint' });
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, request, response, next) => {
  logger.error(error.message);
  if (error.name === 'TypeError')
    return response.status(400).send({ error: 'Invalid blog id'});
  if (error.name === 'SequelizeValidationError')
    return response.status(400).json({ error: error.message });

  next(error);
};

module.exports = {
  unknownEndPoint,
  errorHandler
};
