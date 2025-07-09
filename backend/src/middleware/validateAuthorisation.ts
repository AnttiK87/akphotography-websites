import { Request, Response, NextFunction } from 'express';

import { AppError } from '../errors/AppError.js';
import { verifyToken } from './tokenExtractor.js';
import { getUserById } from '../services/userService.js';

import Comment from '../models/comment.js';
import Reply from '../models/reply.js';

export const validateIsAdmin = async (
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

  if (req.user.role != 'admin') {
    throw new AppError({ en: 'Unauthorized!' }, 401);
  }
  next();
};

export const validateOwner = (resourceKey: 'comment' | 'reply') => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const resource: Comment | Reply = req[resourceKey];
    if (!resource) {
      throw new AppError({ en: `Missing resource: ${resourceKey}` }, 400);
    }
    if (req.body.userId !== resource.userId) {
      throw new AppError(
        { en: `Unauthorized to update this ${resourceKey}` },
        401,
      );
    }

    next();
  };
};

export const validateOwnerOrAdmin = (resourceKey: 'comment' | 'reply') => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const resource = req[resourceKey];
    if (!resource) {
      throw new AppError({ en: `Missing resource: ${resourceKey}` }, 400);
    }

    const isOwner = req.body.userId === resource.userId;

    if (!isOwner) {
      const authorization = req.get('authorization');
      if (!authorization) {
        throw new AppError({ en: 'Authorization bearer not found' }, 401);
      }

      const decoded = await verifyToken(authorization);
      if (!decoded) {
        throw new AppError({ en: 'Token missing!' }, 401);
      }

      const user = await getUserById(decoded.id);
      if (!user) {
        throw new AppError({ en: 'User not found' }, 401);
      }

      const isAdmin = user.role === 'admin';
      if (!isOwner && !isAdmin) {
        throw new AppError(
          {
            fi: 'Et voi poistaa tätä kommenttia',
            en: 'Unauthorized to delete this comment',
          },
          401,
        );
      }

      next();
    } else {
      next();
    }
  };
};
