import { jest } from '@jest/globals';

const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
};

jest.unstable_mockModule('../../src/utils/logger.js', () => ({
  __esModule: true,
  default: mockLogger,
}));

beforeEach(async () => {
  jest.resetModules();

  mockLogger.info.mockClear();
  mockLogger.error.mockClear();
});

afterAll(async () => {
  const { sequelize } = await import('../../src/utils/db.js');
  await sequelize.close();
});

describe('migrationConf.resolve', () => {
  test('runMigration non-Error instances logged correctly', async () => {
    jest.unstable_mockModule('umzug', () => {
      return {
        __esModule: true,
        Umzug: jest.fn().mockImplementation(() => ({
          up: jest.fn().mockImplementation(() => {
            throw 'not-an-error-object';
          }),
          down: jest.fn().mockImplementation(() => {
            throw 'not-an-error-object';
          }),
        })),
        SequelizeStorage: jest.fn(),
      };
    });

    const { runMigrations } = await import('../../src/utils/db.js');

    await expect(runMigrations()).rejects.toBe('not-an-error-object');

    expect(mockLogger.error).toHaveBeenCalledWith(
      'Migration failed',
      'not-an-error-object',
    );
  });

  it('rollbackMigration non-Error instances logged correctly', async () => {
    jest.unstable_mockModule('umzug', () => {
      return {
        __esModule: true,
        Umzug: jest.fn().mockImplementation(() => ({
          up: jest.fn().mockImplementation(() => {
            throw 'not-an-error-object';
          }),
          down: jest.fn().mockImplementation(() => {
            throw 'not-an-error-object';
          }),
        })),
        SequelizeStorage: jest.fn(),
      };
    });

    const { rollbackMigration } = await import('../../src/utils/db.js');

    await rollbackMigration();

    expect(mockLogger.error).toHaveBeenCalledWith(
      'Rolling back migration failed',
      'not-an-error-object',
    );
  });

  test('rollbackMigration handles undefined result from umzug', async () => {
    jest.unstable_mockModule('umzug', () => ({
      __esModule: true,
      Umzug: jest.fn().mockImplementation(() => ({
        up: jest.fn(),
        down: jest.fn().mockResolvedValue(undefined as never),
      })),
      SequelizeStorage: jest.fn(),
    }));

    const { rollbackMigration } = await import('../../src/utils/db.js');

    await rollbackMigration();

    expect(mockLogger.info).not.toHaveBeenCalled();
    expect(mockLogger.error).toHaveBeenCalledWith('Migration undefined.');
  });

  test('rollbackMigration handles undefined result from umzug', async () => {
    jest.unstable_mockModule('umzug', () => ({
      __esModule: true,
      Umzug: jest.fn().mockImplementation(() => ({
        up: jest.fn().mockResolvedValue(undefined as never),
        down: jest.fn(),
      })),
      SequelizeStorage: jest.fn(),
    }));

    const { runMigrations } = await import('../../src/utils/db.js');

    await runMigrations();

    expect(mockLogger.info).not.toHaveBeenCalled();
    expect(mockLogger.error).toHaveBeenCalledWith('Migration undefined.');
  });
});
