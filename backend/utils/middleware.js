// Middlewares used by the application

// Dependencies
const logger = require('./logger');

// Middleware for logging HTTP requests
const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method);
  logger.info('Path:  ', request.path);
  logger.info('Body:  ', request.body);
  logger.info('---');
  next();
};

// Middleware for extracting and verifying JWT tokens
const jwt = require('jsonwebtoken');
const { SECRET } = require('./config');
const Session = require('../models/session');

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization');

  if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
    return next(new Error('TOKEN_MISSING'));
  }

  try {
    const token = authorization.substring(7);
    const session = await Session.findOne({ where: { activeToken: token } });

    if (!session) {
      return next(new Error('NOT_LOGGED_IN'));
    }

    req.decodedToken = jwt.verify(token, SECRET);

    if (req.decodedToken.exp <= Math.floor(Date.now() / 1000)) {
      return next(new Error('TOKEN_EXPIRED'));
    }

    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return next(new Error('TOKEN_INVALID'));
  }
};

// Middleware for handling unknown endpoint error
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response) => {
  console.error(error.message);

  if (error.name === 'SequelizeValidationError') {
    const messages = error.errors.map((err) => err.message);
    return response.status(400).json({ error: 'Validation error', messages });
  } else if (error.name === 'SequelizeDatabaseError') {
    return response.status(400).json({ error: 'Database error' });
  } else if (error.name === 'SequelizeUniqueConstraintError') {
    return response.status(400).json({ error: 'Username must be unique' });
  }

  switch (error.message) {
    case 'TOKEN_MISSING':
      return response.status(401).json({ error: 'Token missing' });

    case 'NOT_LOGGED_IN':
      return response.status(401).json({ error: 'You are not logged in!' });

    case 'TOKEN_EXPIRED':
      return response
        .status(401)
        .json({ error: 'Your session has expired. Please login again' });

    case 'TOKEN_INVALID':
      return response.status(401).json({ error: 'Invalid token' });

    default:
      return response.status(500).json({ error: 'Something went wrong' });
  }
};

// Exports
module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
};
