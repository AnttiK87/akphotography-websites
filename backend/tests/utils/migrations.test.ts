import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sequelize } from '../../src/utils/db.js';
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
});
