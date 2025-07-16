import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError.js';
import { getUserById } from '../services/userService.js';

export const userExtractor = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const token = req.decodedToken;
  if (!token) {
    throw new AppError({ en: 'Token missing!' }, 401);
  }

  const user = await getUserById(token.id);
  if (!user) {
    throw new AppError({ en: 'User not found' }, 401);
  }

  req.user = user;
  next();
};
