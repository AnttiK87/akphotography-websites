import { connectToDatabase, sequelize } from '../src/utils/db.js';
import { createDefaultUser } from '../src/utils/createDefaultUser.js';

beforeAll(async () => {
  if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'test') {
    throw new Error('ERROR: Test are not running in test environment.');
  }

  await connectToDatabase();
  await createDefaultUser();
}, 30000);

afterAll(async () => {
  await sequelize.close();
});

import fs from 'fs/promises';
import path from 'path';

const foldersToClean = [
  path.resolve('tests/tests/uploads/pictures'),
  path.resolve('tests/tests/uploads/thumbnail'),
];

afterAll(async () => {
  for (const folder of foldersToClean) {
    try {
      const files = await fs.readdir(folder);

      await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(folder, file);
          const stat = await fs.stat(filePath);

          if (stat.isFile()) {
            await fs.unlink(filePath);
          }
        }),
      );
    } catch (err) {
      console.error(`Error cleaning folder ${folder}:`, err);
    }
  }
});
