import { AppError } from '../../src/errors/AppError.js';

describe('AppError', () => {
  test('creates error with English message', () => {
    const error = new AppError({ en: 'Something went wrong' }, 400, true);
    expect(error.message).toBe('Something went wrong');
    expect(error.statusCode).toBe(400);
    expect(error.isOperational).toBe(true);
  });

  test('creates error with Finnish message', () => {
    const error = new AppError({ fi: 'Jotain meni pieleen' }, 404);
    expect(error.message).toBe('Jotain meni pieleen');
    expect(error.statusCode).toBe(404);
    expect(error.isOperational).toBe(false);
  });

  test('creates error with default message', () => {
    const error = new AppError({});
    expect(error.message).toBe('Unknown error');
    expect(error.statusCode).toBe(500);
    expect(error.isOperational).toBe(false);
  });
});
