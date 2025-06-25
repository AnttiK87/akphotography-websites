// Loggers for showing info and errors messages at the console

// Logger for info messages
const info = (...params: string[]): void => {
  if (process.env.NODE_ENV !== 'test') {
    console.warn(...params);
  }
};

// Logger for error messages
const error = (...params: string[]): void => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(...params);
  }
};

// Exports
export default {
  info,
  error,
};
