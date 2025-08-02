import express from 'express';
import 'express-async-errors';
import cors from 'cors';

import { connectToDatabase } from './utils/db.js';
import { createDefaultUser } from './utils/createDefaultUser.js';
import { getPath } from './utils/pathUtils.js';

import { unknownEndpoint, errorHandler } from './middleware/errorHandlers.js';

import picturesRouter from './controllers/pictures.js';
import ratingsRouter from './controllers/ratings.js';
import commentsRouter from './controllers/comments.js';
import repliesRouter from './controllers/replies.js';
import keywordsRouter from './controllers/keywords.js';
import contactFormRouter from './controllers/contactForm.js';
import usersRouter from './controllers/users.js';
import loginRouter from './controllers/login.js';
import logoutRouter from './controllers/logout.js';

const app = express();

app.use(cors());
app.use(express.json());

const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';
const uploadsPath = isProduction
  ? 'public_html/uploads'
  : isTest
    ? 'uploads'
    : 'backend/public_html/uploads';
const distPath = isProduction
  ? 'public_html/dist'
  : isTest
    ? '../public_html/dist'
    : 'backend/public_html/dist';

app.use('/uploads', express.static(getPath(uploadsPath)));

app.use('/api/pictures', picturesRouter);
app.use('/api/ratings', ratingsRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/replies', repliesRouter);
app.use('/api/keywords', keywordsRouter);
app.use('/api/contact', contactFormRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/logout', logoutRouter);

await connectToDatabase();
await createDefaultUser();

app.use(express.static(getPath(distPath)));

app.get(/^\/(?!api).*/, (_req, res) => {
  res.sendFile(getPath(distPath, 'index.html'));
});

app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
