const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');

const { connectToDatabase } = require('./utils/db');
const middleware = require('./utils/middleware');

const picturesRouter = require('./controllers/pictures');
const ratingsRouter = require('./controllers/ratings');
const commentsRouter = require('./controllers/comments');
const repliesRouter = require('./controllers/replies');
const keywordsRouter = require('./controllers/keywords');
const contactFormRouter = require('./controllers/contactForm');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const logoutRouter = require('./controllers/logout');

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors());
app.use(express.json());

app.use('/api/pictures', picturesRouter);
app.use('/api/ratings', ratingsRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/replies', repliesRouter);
app.use('/api/keywords', keywordsRouter);
app.use('/api/contact', contactFormRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/logout', logoutRouter);

connectToDatabase();

app.use(express.static('dist'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);
module.exports = app;
