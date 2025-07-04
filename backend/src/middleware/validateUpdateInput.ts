import { Request, Response, NextFunction } from 'express';

import { AppError } from '../errors/AppError.js';

import { formatMonthYear } from '../utils/formatMonthYear.js';

import { getTextIfExist } from '../services/pictureService.js';
import { attachKeywordsToPicture } from '../services/keywordService.js';

import Text from '../models/text.js';
import Rating from '../models/rating.js';
import Picture from '../models/picture.js';

import {
  userInfoUpdateSchema,
  pictureUpdateSchema,
  commentUpdateSchema,
  replyUpdateSchema,
} from '../schemas/index.js';

import { PictureUpdateInput } from '../types/types.js';
export const handlePictureUpdates = async (
  req: Request<object, object, PictureUpdateInput>,
  _res: Response,
  next: NextFunction,
) => {
  const { type, textFi, textEn, year, month, keywords } =
    pictureUpdateSchema.parse(req.body);
  const picture: Picture = req.picture;

  if (type === 'monthly') {
    if (!year || !month) {
      throw new AppError(
        { en: 'Year and month required for monthly pictures' },
        400,
      );
    }
  }

  const newMonthYear =
    type === 'monthly' && year && month ? formatMonthYear(year, month) : null;

  let text: Text | null = await getTextIfExist(picture.textId);

  const textChanged =
    (textFi ?? null) !== (text?.textFi ?? null) ||
    (textEn ?? null) !== (text?.textEn ?? null);

  const typeChanged = picture.type !== type;
  const monthYearChanged = picture.monthYear !== newMonthYear;
  const keywordsChanged = keywords !== null;

  const noChanges =
    !textChanged && !typeChanged && !monthYearChanged && !keywordsChanged;

  if (noChanges)
    return next(
      new AppError(
        { fi: 'Et muuttanut tietoja', en: 'No changes provided' },
        400,
      ),
    );

  // Text
  if (!text && (textFi || textEn)) {
    text = await Text.create({
      textFi: textFi?.trim() || null,
      textEn: textEn?.trim() || null,
      pictureId: picture.id,
    });
    picture.textId = text.id;
  } else if (text && textFi === null && textEn === null) {
    await text.destroy();
    picture.textId = null;
  } else if (textChanged && text) {
    text.textFi = textFi?.trim() || '';
    text.textEn = textEn?.trim() || '';
    await text.save();
  }

  // Keywords
  if (keywordsChanged && keywords) {
    await attachKeywordsToPicture(picture, keywords);
  }

  // Type
  if (typeChanged) {
    picture.type = type;
  }

  // MonthYear
  if (type === 'monthly') {
    picture.monthYear = newMonthYear;
  } else if (picture.monthYear) {
    picture.monthYear = null;
  }

  next();
};

// handle case if user has already given rating
// delete rating if new rating is zero or update rating with new value
export const handleRatingChange = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId, pictureId, rating } = req.body;

  // get rating related to picture and given by specific user
  const existing = await Rating.findOne({ where: { userId, pictureId } });

  // if rating exist handle change or deletion
  if (existing) {
    if (rating === 0) {
      await existing.destroy();
      res.status(200).json({ message: 'Rating deleted', id: existing.id });
      return;
    } else {
      const updated = await existing.update({ rating });
      res.json({ message: 'Rating updated', rating: updated });
      return;
    }
  }

  next();
};

// handle and validate user information update
// returns object with validated and updated info to controller
export const handleUserInfoChange = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const parsed = userInfoUpdateSchema.parse(req.body);
  const { username, name, email } = parsed;

  const changes: Partial<typeof req.user> = {};

  if (username !== req.user.username) changes.username = username;
  if (name !== req.user.name) changes.name = name;
  if (email !== req.user.email) changes.email = email;

  if (Object.keys(changes).length === 0) {
    throw new AppError(
      { fi: 'Et muuttanut tietoja', en: 'No changes provided' },
      400,
    );
  }

  Object.assign(req.user, changes);
  next();
};

export const commentChangeHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const parsed = commentUpdateSchema.parse(req.body);
  const { username, comment } = parsed;

  const changes: Partial<typeof req.comment> = {};

  if (username !== req.comment.username) changes.username = username;
  if (comment !== req.comment.comment) changes.comment = comment;

  if (Object.keys(changes).length === 0) {
    throw new AppError(
      { fi: 'Et muuttanut tietoja', en: 'No changes provided' },
      400,
    );
  }

  Object.assign(req.comment, changes);
  next();
};

export const replyChangeHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const parsed = replyUpdateSchema.parse(req.body);
  const { username, reply } = parsed;

  const changes: Partial<typeof req.reply> = {};

  if (username !== req.reply.username) changes.username = username;
  if (reply !== req.reply.reply) changes.reply = reply;

  if (Object.keys(changes).length === 0) {
    throw new AppError(
      { fi: 'Et muuttanut tietoja', en: 'No changes provided' },
      400,
    );
  }

  Object.assign(req.reply, changes);
  next();
};
