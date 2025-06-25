import { Request, Response, NextFunction } from 'express';

import { AppError } from '../errors/AppError.js';
import { tokenExtractor } from './tokenExtractor.js';

import Comment from '../models/comment.js';
import Reply from '../models/reply.js';

export function validateIsAdmin(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const isAdmin = req.decodedToken;

  if (!isAdmin) {
    throw new AppError({ en: 'unauthorized' }, 401);
  }
  next();
}

export function validateOwner(resourceKey: 'comment' | 'reply') {
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
}

export function validateOwnerOrAdmin(resourceKey: 'comment' | 'reply') {
  return async (req: Request, res: Response, next: NextFunction) => {
    const resource = req[resourceKey];
    if (!resource) {
      throw new AppError({ en: `Missing resource: ${resourceKey}` }, 400);
    }

    const isOwner = req.body.userId === resource.userId;

    // Check if user is not the owner of the comment.
    if (!isOwner) {
      //In this case uses the tokenExtractor middleware to check if the user is admin.
      tokenExtractor(req, res, async (err) => {
        if (err) {
          next(err);
          return;
        }
        // throw error if user is not authorized.
        const isAdmin = req.decodedToken;
        if (!isOwner && !isAdmin) {
          throw new AppError(
            {
              fi: 'Et voi poistaa tätä kommenttia',
              en: 'Unauthorized to delete this comment',
            },
            401,
          );
        }
      });
    }
    next();
  };
}
