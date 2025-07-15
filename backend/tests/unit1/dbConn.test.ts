import { jest } from '@jest/globals';

describe('connectToDatabase error handling', () => {
  // Removed unused assignment of sequelize; import only as needed for types

  let connectToDatabase: () => Promise<void>;
  let exitSpy: jest.Spied<() => Promise<void>>;
  let authenticateSpy: jest.Spied<() => Promise<void>>;

  beforeAll(async () => {
    // Importataan db.js vain kerran ennen testejä
    const dbModule = await import('../../src/utils/db.js');
    connectToDatabase = dbModule.connectToDatabase;

    // Spyataan sequelize.authenticate
    authenticateSpy = jest.spyOn(dbModule.sequelize, 'authenticate');
  });

  beforeEach(() => {
    // Mockataan authenticate aina epäonnistumaan
    authenticateSpy.mockRejectedValue(new Error('Simulated failure'));

    // Spyataan process.exit ja korvataan se heitolla virheestä
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

  it('calls process.exit(1) after max retries in production', async () => {
    await expect(connectToDatabase()).rejects.toThrow('process.exit: 1');
    expect(exitSpy).toHaveBeenCalledWith(1);
  }, 20000);
});
