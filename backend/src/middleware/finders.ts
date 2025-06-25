import { Request, Response, NextFunction } from 'express';

import { AppError } from '../errors/AppError.js';

import { Model, ModelStatic } from 'sequelize';

import Picture from '../models/picture.js';
import User from '../models/user.js';
import Reply from '../models/reply.js';
import Comment from '../models/comment.js';
import Keyword from '../models/keyword.js';

const resourceFinder = <T extends Model>(
  resourceName: string,
  reqPropertyName: string,
  model: ModelStatic<T>,
) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const resource = await model.findByPk(req.params.id);
    if (!resource) {
      throw new AppError({ en: `${resourceName} not found` }, 404);
    }

    if (reqPropertyName === 'picture') {
      req.picture = resource;
    } else if (reqPropertyName === 'reply') {
      req.reply = resource;
    } else if (reqPropertyName === 'comment') {
      req.comment = resource;
    } else if (reqPropertyName === 'keyword') {
      req.keyword = resource;
    } else {
      req.user = resource;
    }
    next();
  };
};

export const pictureFinder = resourceFinder('Picture', 'picture', Picture);
export const replyFinder = resourceFinder('Reply', 'reply', Reply);
export const commentFinder = resourceFinder('Comment', 'comment', Comment);
export const keywordFinder = resourceFinder('Keyword', 'keyword', Keyword);
export const userFinder = resourceFinder('User', 'user', User);
