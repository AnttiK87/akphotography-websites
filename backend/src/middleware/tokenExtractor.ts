import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';

import { SECRET } from '../utils/config.js';
import { AppError } from '../errors/AppError.js';

import { getSessionByToken } from '../services/sessionService.js';

import { DecodedToken } from '../types/express.js';

import Sessions from '../models/session.js';

// Middleware for extracting jwt token
export const tokenExtractor: RequestHandler = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const authenticatedReq = req;
    const authorization = req.get('authorization');
    const decoded = await verifyToken(authorization || '');
    authenticatedReq.decodedToken = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

export const verifyToken = async (
  authorization: string,
): Promise<DecodedToken> => {
  if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
    throw new AppError({ en: 'Token missing' }, 401);
  }

  const token = authorization.substring(7);
  const session = await getSessionByToken(token);

  if (!session) {
    throw new AppError({ en: 'You are not logged in' }, 401);
  }

  try {
    const decoded = jwt.verify(token, SECRET) as DecodedToken;

    if (!decoded || typeof decoded !== 'object' || !decoded.id) {
      throw new AppError({ en: 'Invalid token' }, 401);
    }

    return decoded;
  } catch (error) {
    const err = error as JsonWebTokenError;

    if (err.name === 'TokenExpiredError') {
      await Sessions.destroy({ where: { activeToken: token } });
      throw new AppError({ en: 'Token expired' }, 401);
    }

    throw new AppError({ en: 'Invalid token' }, 401);
  }
};
