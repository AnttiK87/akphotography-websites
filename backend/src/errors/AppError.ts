// src/errors/AppError.ts

// Custom application-specific error class.
// Extends the built-in Error and includes:
// - message for error message
// - HTTP status code
// - isOperational flag to indicate whether the error is safe to show to end users.

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public messages: { fi?: string; en?: string };

  constructor(
    messages: { fi?: string; en?: string },
    statusCode = 500,
    isOperational = false,
  ) {
    super(messages.en || messages.fi || 'Unknown error');
    this.name = 'AppError';
    this.messages = messages;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
  }
}
