import { jest } from '@jest/globals';

describe('exits with code 1 on DB connection failure', () => {
  let connectToDatabase: () => Promise<void>;
  let exitSpy: jest.Spied<() => Promise<void>>;
  let authenticateSpy: jest.Spied<() => Promise<void>>;

  beforeAll(async () => {
    const dbModule = await import('../../src/utils/db.js');
    connectToDatabase = dbModule.connectToDatabase;

    authenticateSpy = jest.spyOn(dbModule.sequelize, 'authenticate');
  });

  beforeEach(() => {
    authenticateSpy.mockRejectedValue(new Error('Simulated failure'));

    exitSpy = jest
      .spyOn(process, 'exit')
      .mockImplementation((code?: string | number | null | undefined) => {
        throw new Error(`process.exit: ${code}`);
      });
    process.env.NODE_ENV = 'production';
  });

  afterEach(() => {
    authenticateSpy.mockReset();
    exitSpy.mockRestore();
    delete process.env.NODE_ENV;
  });

  test('calls process.exit(1) after max retries in production', async () => {
    await expect(connectToDatabase()).rejects.toThrow('process.exit: 1');
    expect(exitSpy).toHaveBeenCalledWith(1);
  }, 20000);
});
