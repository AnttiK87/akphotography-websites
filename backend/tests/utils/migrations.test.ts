import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sequelize, rollbackMigration } from '../../src/utils/db.js';
import { getMigrationGlob } from '../../src/utils/migrationGlob.js';
import { QueryTypes } from 'sequelize';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Migrations folder', () => {
  const migrationsDir = path.join(__dirname, '../..', 'src/migrations');
  const migrationFiles = fs.readdirSync(migrationsDir);
  const sortedMigrations = migrationFiles.sort();

  test('Lists all migration files', () => {
    expect(sortedMigrations.length).toBeGreaterThan(0);
  });

  test('Latest migration is applied', async () => {
    const rows = await sequelize.query<{ name: string }>(
      'SELECT * FROM migrations',
      { type: QueryTypes.SELECT },
    );

    const dbMigrations = rows.map((r) => path.basename(r.name));
    const latestMigration = dbMigrations.at(-1);
    const expected = sortedMigrations.at(-1);

    expect(latestMigration).toBe(expected);
  });

  test('Rollback removes latest migration from migrations table', async () => {
    await rollbackMigration();
    const rows = await sequelize.query<{ name: string }>(
      'SELECT * FROM migrations',
      { type: QueryTypes.SELECT },
    );

    const dbMigrations = rows.map((r) => path.basename(r.name));
    const latestMigration = dbMigrations.at(-1);
    const expected = sortedMigrations.at(-2);

    expect(latestMigration).toBe(expected);
  });

  test('all migrations rollsback', async () => {
    const rows = await sequelize.query<{ name: string }>(
      'SELECT * FROM migrations',
      { type: QueryTypes.SELECT },
    );

    for (let i = 0; i < rows.length; i++) {
      await rollbackMigration();
    }

    const tables = await sequelize.query<{ [key: string]: string }>(
      'SHOW TABLES',
      { type: QueryTypes.SELECT },
    );
    const tableNames = tables.map(Object.values).flat();

    expect(tableNames).toEqual(['migrations']);
  });
});

describe('getMigrationGlob', () => {
  const originalEnv = process.env.NODE_ENV;

  afterAll(() => {
    process.env.NODE_ENV = originalEnv;
  });

  test('returns migration glob when files exist', async () => {
    const glob = await getMigrationGlob();
    expect(glob).toBe('src/migrations/*.ts');
  });

  test('throws if no migration files found in production', async () => {
    process.env.NODE_ENV = 'production';
    await expect(getMigrationGlob()).rejects.toThrow(
      'No migration files found at path: migrations/*.js',
    );
  });
});
