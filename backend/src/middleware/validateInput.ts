import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import sharp from 'sharp';

import { AppError } from '../errors/AppError.js';
import { getPictureById } from '../services/pictureService.js';
import { UserInput } from '../types/types.js';

import Picture from '../models/picture.js';
import Comment from '../models/comment.js';

import {
  ratingSchema,
  commentSchema,
  replySchema,
  contactFormSchema,
  loginSchema,
  pictureSchema,
  userInputSchema,
  newUserPasswordSchema,
  passwordSchema,
  userInfoUpdateSchema,
} from '../schemas/index.js';

export const validateRatingInput = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const parsedRating = ratingSchema.parse(req.body);

  const picture = await getPictureById(parsedRating.pictureId);
  if (!picture) {
    throw new AppError({ fi: 'Kuvaa ei löydy', en: 'Picture not found' }, 404);
  }

  req.body = parsedRating;

  next();
};

export async function validateCommentInput(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const parsedComment = commentSchema.parse(req.body);

  const picture = await Picture.findByPk(parsedComment.pictureId);
  if (!picture) {
    throw new AppError(
      {
        fi: 'Kommenttiin liittyvää kuvaa ei löydy',
        en: 'Picture related to comment not found',
      },
      404,
    );
  }
  req.body = parsedComment;
  next();
}

export const validateReplyInput = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const parsedReply = replySchema.parse(req.body);

  const picture = await Picture.findByPk(parsedReply.pictureId);
  if (!picture) {
    throw new AppError(
      {
        fi: 'Vastaukseen liittyvä kuvaa ei löydy',
        en: 'Picture related to reply not found',
      },
      404,
    );
  }

  const comment = await Comment.findByPk(parsedReply.commentId);
  if (!comment) {
    throw new AppError(
      {
        fi: 'Kommenttia johon yrität vastata ei löydy',
        en: 'Comment you are trying to reply not found',
      },
      404,
    );
  }

  req.body = parsedReply;
  next();
};

export function validateContactFormInput(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const parsedFormData = contactFormSchema.parse(req.body);
  req.body = parsedFormData;
  next();
}

export function validateLoginInput(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const parsedlogin = loginSchema.parse(req.body);
  req.body = parsedlogin;
  next();
}

export async function validatePictureUploadInput(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const { type, year, month } = pictureSchema.parse(req.body);
  const parsedPicture = pictureSchema.parse(req.body);

  if (!req.file || !req.file.path) {
    throw new AppError({ en: 'File was not uploaded!' }, 400);
  }

  if (!type) {
    throw new AppError({ en: 'Missing required field: type' }, 400);
  }

  const metadata = await sharp(req.file.path).metadata();

  if (!metadata || !metadata.width || !metadata.height) {
    throw new AppError({ en: 'Could not read image dimensions' }, 400);
  }

  req.metadata = {
    width: metadata.width,
    height: metadata.height,
  };

  if (type === 'monthly') {
    if (!year || !month) {
      throw new AppError(
        { en: 'Year and month required for monthly pictures' },
        400,
      );
    }
  }

  req.body = parsedPicture;
  next();
}

export const validateNewUserInput = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const parsedNewUser = userInputSchema.parse(req.body);
  req.body = parsedNewUser;
  next();
};

export const validateNewUserPassword = async (
  req: Request<object, object, UserInput>,
  _res: Response,
  next: NextFunction,
) => {
  const { password } = newUserPasswordSchema.parse(req.body);

  const passwordHash = await bcrypt.hash(password, 10);
  req.passwordHash = passwordHash;

  next();
};

export const validatePasswordChange = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { oldPassword, newPassword1, newPassword2 } = req.body;
  const user = req.user;

  const passwordCorrect = await bcrypt.compare(oldPassword, user.passwordHash);
  if (!passwordCorrect) {
    throw new AppError({ en: 'Invalid old password' }, 401);
  }

  passwordSchema.parse({ oldPassword, newPassword1, newPassword2 });

  const passwordHash = await bcrypt.hash(newPassword1, 10);
  user.passwordHash = passwordHash;

  next();
};

export const validateFirstLoginPasswordChange = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { password, passwordConfirmation, name, username, email } = req.body;
  const user = req.user;

  newUserPasswordSchema.parse({ password, passwordConfirmation });
  userInfoUpdateSchema.parse({ name, username, email });

  const passwordHash = await bcrypt.hash(password, 10);
  user.passwordHash = passwordHash;

  next();
};
