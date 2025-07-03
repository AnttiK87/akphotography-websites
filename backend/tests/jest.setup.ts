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
