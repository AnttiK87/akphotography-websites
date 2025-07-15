import { jest } from '@jest/globals';

const mockGetMigrationGlob = jest.fn();

jest.unstable_mockModule('../../src/utils/migrationGlob.js', () => ({
  __esModule: true,
  getMigrationGlob: mockGetMigrationGlob,
}));

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
  await sequelize.query(
    "DELETE FROM migrations WHERE name = 'broken-rollback.ts'",
  );
  await sequelize.close();
});

describe('connectToDatabase in production env', () => {
  const orginalEnv = process.env.NODE_ENV;
  afterEach(() => {
    process.env.NODE_ENV = orginalEnv;
  });

  it('calls process.exit(1) after max retries in production', async () => {
    process.env.NODE_ENV = 'production';
    mockGetMigrationGlob.mockResolvedValueOnce(
      'tests/mockMigration/rollback/*.ts' as never,
    );
    const { connectToDatabase } = await import('../../src/utils/db.js');
    await connectToDatabase();

    expect(mockLogger.info).toHaveBeenCalledWith('database connected');
  }, 20000);
});
