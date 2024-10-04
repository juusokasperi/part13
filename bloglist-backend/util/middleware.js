const logger = require('./logger');
const jwt = require('jsonwebtoken');
const { SECRET } = require('./config');

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method);
  logger.info('Path:', request.path);
  logger.info('Body:', request.body);
  logger.info('---');
  next();
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer '))
    req.token = authorization.replace('Bearer ', '');
  next();
};

const userExtractor = (request, response, next) => {
  if (!request.token) {
    return response.status(401).send({ error: 'no token' });
  }
  request.user = jwt.verify(request.token, SECRET);
  next();
};

// eslint-disable-next-line no-unused-vars
const unknownEndPoint = (request, response) => {
  return response.status(404).send({ error: 'Unknown endpoint' });
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, request, response, next) => {
  logger.error(error.message);
  if (error.message === 'invalid blog id')
    return response.status(400).send({ error: 'Invalid blog id' });
  if (error.message === 'invalid user')
    return response.status(400).send({ error: 'Invalid username/user-id' });
  if (error.name === 'SequelizeValidationError') {
    const formattedErrors = {};
    error.errors.forEach(err => {
      formattedErrors[err.path] = err.message;
    });
    return response.status(400).json({ error: formattedErrors });
  }
  if (error.name === 'TokenExpiredError')
    return response.status(401).json({ error: 'token expired' });
  next(error);
};

module.exports = {
  tokenExtractor,
  userExtractor,
  requestLogger,
  unknownEndPoint,
  errorHandler
};
