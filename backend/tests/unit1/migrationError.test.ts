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
  await sequelize.close();
});

describe('Migration fails', () => {
  test('throws error and calls logger error with broken migration', async () => {
    mockGetMigrationGlob.mockResolvedValueOnce(
      'tests/mockMigration/migration/broken-migration.ts' as never,
    );

    const { connectToDatabase } = await import('../../src/utils/db.js');

    await expect(connectToDatabase()).rejects.toThrow(
      'Migration broken-migration.ts (up) failed: Original error: Simulated migration failure',
    );

    expect(mockLogger.error).toHaveBeenCalledWith(
      'Migration failed',
      'Migration broken-migration.ts (up) failed: Original error: Simulated migration failure',
    );
  }, 20500);

  test('fails to roll back if all migrations already rolled back', async () => {
    mockGetMigrationGlob.mockResolvedValueOnce(
      'tests/mockMigration/migration/*.ts' as never,
    );

    const { rollbackMigration } = await import('../../src/utils/db.js');
    await rollbackMigration();

    expect(mockLogger.info).toHaveBeenCalledWith(
      'No migration was rolled back. Database is at base state or already at previous step.',
    );
  });

  test('throws error and calls logger error with broken rollback', async () => {
    mockGetMigrationGlob.mockResolvedValueOnce(
      'tests/mockMigration/rollback/*.ts' as never,
    );

    const { connectToDatabase, rollbackMigration, sequelize } = await import(
      '../../src/utils/db.js'
    );

    await connectToDatabase();
    await rollbackMigration();

    expect(mockLogger.error).toHaveBeenCalledWith(
      'Rolling back migration failed',
      'Migration broken-rollback.ts (down) failed: Original error: Simulated migration failure',
    );

    await sequelize.query(
      "DELETE FROM migrations WHERE name = 'broken-rollback.ts'",
    );
  }, 20000);

  test('Rollsback succesfully', async () => {
    mockGetMigrationGlob.mockResolvedValueOnce(
      'tests/mockMigration/migration/working-migration.ts' as never,
    );

    const { connectToDatabase, rollbackMigration, sequelize } = await import(
      '../../src/utils/db.js'
    );

    await connectToDatabase();
    await rollbackMigration();

    expect(mockLogger.info).toHaveBeenCalledWith(
      'Rolled back migration: working-migration.ts',
    );

    await sequelize.query(
      "DELETE FROM migrations WHERE name = 'working-migration.ts'",
    );
  }, 20000);
});

import type { QueryInterface } from 'sequelize';
const { migrationResolve } = await import('../../src/utils/db.js');

const createMockQueryInterface = (): QueryInterface => {
  return {} as unknown as QueryInterface;
};

describe('migrationConf.resolve', () => {
  test('throws if path is undefined', () => {
    const mockContext = createMockQueryInterface();

    expect(() =>
      migrationResolve({ path: undefined, context: mockContext }),
    ).toThrow('Migration path is undefined');
  });

  test('throws if path is null', () => {
    const mockContext = createMockQueryInterface();

    expect(() =>
      migrationResolve({
        path: null as unknown as string,
        context: mockContext,
      }),
    ).toThrow('Migration path is undefined');
  });
});
