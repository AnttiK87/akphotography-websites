// Dependencies
import { Request, Response, NextFunction } from 'express';
import {
  ValidationError,
  UniqueConstraintError,
  DatabaseError,
} from 'sequelize';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError.js';
import { deleteFile } from '../utils/fileUtils.js';

// Middleware for handling unknown endpoints
// This function is used to catch requests to endpoints that do not exist.
export const unknownEndpoint = (_req: Request, res: Response): void => {
  res.status(404).send({ error: 'unknown endpoint' });
};

// Middleware for handling validation
// This function catches errors thrown in the application and formats them for the client.
// It checks for specific error types and responds with appropriate status codes and messages.
// If the error is not recognized, it defaults to a 500 Internal Server Error.
export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (req.file?.path) {
    deleteFile(req.file.path);
  }

  if (req.file?.thumbnailPath) {
    deleteFile(req.file.thumbnailPath);
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      status: 'error',
      messages: error.messages,
    });
    return;
  } else if (error instanceof ZodError) {
    res.status(400).json({
      status: 'error',
      error: 'Validation error',
      messages: error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  } else if (error instanceof ValidationError) {
    const messages = error.errors.map((err) => err.message);
    res.status(400).json({
      status: 'error',
      error: 'Validation error',
      messages,
    });
    return;
  } else if (error instanceof UniqueConstraintError) {
    res.status(409).json({
      status: 'error',
      error: 'Username must be unique',
      code: 'USERNAME_TAKEN',
    });
    return;
  } else if (error instanceof DatabaseError) {
    res.status(500).json({
      status: 'error',
      error: 'Database error',
      code: 'DB_ERROR',
    });
    return;
  } else {
    res.status(500).json({
      status: 'error',
      error: 'Something went wrong',
      code: 'UNKNOWN_ERROR',
    });
  }
  console.error('Error:', error);
  next(error);
};
