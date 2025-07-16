import { jest } from '@jest/globals';

const mockConfig = jest.fn();
jest.unstable_mockModule('dotenv', () => ({
  config: mockConfig,
}));

describe('config.ts', () => {
  beforeEach(() => {
    jest.resetModules();
    mockConfig.mockClear();
    delete process.env.NODE_ENV;
    delete process.env.PORT;
  });
  afterEach(() => {
    jest.resetModules();
    delete process.env.PORT;
    delete process.env.NODE_ENV;
  });

  test('uses .env.test file on test enviroment', async () => {
    process.env.NODE_ENV = 'test';
    await import('../../src/utils/config.js');
    expect(mockConfig).toHaveBeenCalledWith({ path: '.env.test' });
  });

  test('uses .env file on other enviroments', async () => {
    process.env.NODE_ENV = 'production';
    await import('../../src/utils/config.js');
    expect(mockConfig).toHaveBeenCalledWith({ path: '.env' });
  });

  test('uses default port 3000 if PORT is not provided on .env file', async () => {
    const config = await import('../../src/utils/config.js');
    expect(config.PORT).toBe(3000);
  });

  test('uses PORT value given as env', async () => {
    process.env.PORT = '8080';
    const config = await import('../../src/utils/config.js');
    expect(config.PORT).toBe(8080);
  });
});
