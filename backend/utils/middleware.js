// Middlewares used by the application

// Dependencies
const logger = require('./logger')

// Middleware for logging HTTP requests
const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

// Middleware for getting token of token based login
// Middleware for extracting token from request and checking if it is valid and has active session
const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')
const Session = require('../models/session')

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      let session = await Session.findOne({
        where: {
          activeToken: authorization.substring(7),
        },
      })
      if (!session) {
        return res.status(401).json({ error: 'You are not logged in!' })
      }
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)

      if (decoded.exp * 1000 < Date.now()) {
        return res
          .status(401)
          .json({ error: 'Your session has expired. Please login again' })
      }
    } catch (error) {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

// Middleware for handling unknown endpoint error
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// Middleware for handling errors
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'SequelizeValidationError') {
    const messages = error.errors.map((err) => err.message)
    return response.status(400).json({ error: 'Validation error', messages })
  } else if (error.name === 'SequelizeDatabaseError') {
    return response.status(400).json({ error: 'Database error' })
  } else if (error.name === 'SequelizeUniqueConstraintError') {
    return response.status(400).json({ error: 'Username must be unique' })
  }

  next(error)
}

// Exports
module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
}
