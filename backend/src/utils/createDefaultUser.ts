import bcrypt from 'bcryptjs';

import { ADMIN_PASSWORD } from '../utils/config.js';
import User from '../models/user.js';
import logger from './logger.js';

export const createDefaultUser = async () => {
  const existingAdmin = await User.findOne({ where: { role: 'admin' } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await User.create({
      name: 'Administrator',
      username: 'admin',
      passwordHash,
      email: 'admin@example.com',
      role: 'admin',
    });
    logger.info('Default admin user created');
  } else {
    logger.info('Admin user already exists');
  }
};
