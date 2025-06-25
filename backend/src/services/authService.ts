import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { AppError } from '../errors/AppError.js';

import { SECRET } from '../utils/config.js';

import { getUserByUsername } from '../services/userService.js';

import User from '../models/user.js';

export const authenticateUser = async (username: string, password: string) => {
  const user = await getUserByUsername(username);
  const passwordCorrect = user?.passwordHash
    ? await bcrypt.compare(password, user.passwordHash)
    : false;

  if (!user || !passwordCorrect) {
    throw new AppError({ en: 'invalid username or password' }, 401);
  }

  return user;
};

export const generateToken = (user: User): string => {
  return jwt.sign({ username: user.username, id: user.id }, SECRET, {
    expiresIn: '4h',
  });
};
