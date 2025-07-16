import { jest } from '@jest/globals';
import logger from '../../src/utils/logger.js';

describe('logger', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    jest.restoreAllMocks();
  });

  test('calls console.warn in non-test env', () => {
    process.env.NODE_ENV = 'production';
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    logger.info('Info message');
    expect(spy).toHaveBeenCalledWith('Info message');
  });

  test('does not call console.warn in test env', () => {
    process.env.NODE_ENV = 'test';
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    logger.info('Info message');
    expect(spy).not.toHaveBeenCalled();
  });

  test('calls console.error in non-test env', () => {
    process.env.NODE_ENV = 'production';
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    logger.error('Error message');
    expect(spy).toHaveBeenCalledWith('Error message');
  });

  test('does not call console.error in test env', () => {
    process.env.NODE_ENV = 'test';
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    logger.error('Error message');
    expect(spy).not.toHaveBeenCalled();
  });
});
