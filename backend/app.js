const express = require('express')
require('express-async-errors')
const app = express()

const { connectToDatabase } = require('./utils/db')
const middleware = require('./utils/middleware')

const picturesRouter = require('./controllers/pictures')
const ratingsRouter = require('./controllers/ratings')
const commentsRouter = require('./controllers/comments')
const repliesRouter = require('./controllers/replies')
const keywordsRouter = require('./controllers/keywords')
const contactFormRouter = require('./controllers/contactForm')

//for serving photos at the backend
const path = require('path')
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use(express.json())

app.use('/api/pictures', picturesRouter)
app.use('/api/ratings', ratingsRouter)
app.use('/api/comments', commentsRouter)
app.use('/api/replies', repliesRouter)
app.use('/api/keywords', keywordsRouter)
app.use('/api/contact', contactFormRouter)

connectToDatabase()

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
