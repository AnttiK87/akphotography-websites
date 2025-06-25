import { Request, Response, NextFunction } from 'express';

import { getUserById } from '../services/userService.js';

export const userExtractor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.decodedToken;

  const user = await getUserById(token.id);
  if (!user) {
    res.status(401).json({ error: 'User not found' });
    return;
  }

  req.user = user;
  next();
};
