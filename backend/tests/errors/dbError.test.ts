import { DatabaseError } from 'sequelize';
import { jest } from '@jest/globals';
import { errorHandler } from '../../src/middleware/errorHandlers.js';
import { Request, Response } from 'express';

describe('errorhandler middleware', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  test('should throw DatabaseError', async () => {
    const fakeError = {
      message: 'DB failure',
      sql: 'UPDATE users SET ...',
      name: 'SequelizeDatabaseError',
    };

    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    const error = new DatabaseError(fakeError);

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      error: 'Database error',
      code: 'DB_ERROR',
    });
  });

  test('should handle unknown errors with 500 response', () => {
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    const error = new Error('Unexpected error');

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      error: 'Something went wrong',
      code: 'UNKNOWN_ERROR',
    });
    expect(next).toHaveBeenCalledWith(error);
  });
});
