const logger = require('./logger');
const jwt = require('jsonwebtoken');
const { SECRET } = require('./config');
const { Session, User } = require('../models');

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

const userExtractor = async (request, response, next) => {
  if (!request.token) {
    return response.status(401).send({ error: 'no token' });
  }

  const decodedToken = jwt.verify(request.token, SECRET);
  const session = await Session.findOne({
    where: { token: request.token, userId: decodedToken.id },
    include: { model: User, attributes: ['id', 'disabled'] }
  });

  if (!session || session.user.disabled)
    return response.status(401).json({ error: 'login not found or user disabled' });
  if (session.user.id !== decodedToken.id)
    return response.status(401).json({ error: 'token user mismatch' });

  request.user = session.user;
  next();
};

// eslint-disable-next-line no-unused-vars
const unknownEndPoint = (request, response) => {
  return response.status(404).send({ error: 'Unknown endpoint' });
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, request, response, next) => {
  logger.error('Error:', error.message);
  if (error.message === 'invalid blog id')
    return response.status(400).send({ error: 'Invalid blog id' });
  if (error.message === 'invalid user')
    return response.status(400).send({ error: 'Invalid username/user-id' });
  if (error.message === 'invalid reading')
    return response.status(400).send({ error: 'Invalid reading id' });
  if (error.message === 'not authorized')
    return response.status(401).json({ error: 'unauthorized to do operation' });
  if (error.name === 'SequelizeValidationError') {
    const formattedErrors = {};
    error.errors.forEach(err => {
      formattedErrors[err.path] = err.message;
    });
    return response.status(400).json({ error: formattedErrors });
  }
  if (error.name === 'TokenExpiredError')
    return response.status(401).json({ error: 'token expired' });
  if (error.name === 'JsonWebTokenError')
    return response.status(401).json({ error: 'invalid token' });
  next(error);
};

module.exports = {
  tokenExtractor,
  userExtractor,
  requestLogger,
  unknownEndPoint,
  errorHandler
};
