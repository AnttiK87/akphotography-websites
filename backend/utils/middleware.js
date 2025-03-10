// Middlewares used by the application

// Dependencies
const logger = require('./logger')
//const jwt = require('jsonwebtoken')
//const User = require('../models/user')

// Middleware for logging HTTP requests
const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

// Middleware for handling unknown endpoint error
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// Middleware for getting token of token based login
/*const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  } else {
    request.token = null
  }
  next()
}*/

// Middleware for getting user information
/*const userExtractor = async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }

    const user = await User.findById(decodedToken.id)
    if (!user) {
      return response.status(404).json({ error: 'user not found' })
    }

    request.user = user
    next()
  } catch (error) {
    next(error)
  }
}*/

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
  /*tokenExtractor,
  userExtractor,*/
}
