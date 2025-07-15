import { upload } from '../utils/multerConfig.js';
import { AppError } from '../errors/AppError.js';
import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

export const uploadSingleImage = upload.single('image');

export const handleUpload = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  uploadSingleImage(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(
          new AppError({ en: 'File too large, max file size 6MB' }, 400),
        );
      }
    }

    if (!req.file && req.fileValidationError === 'goes wrong on the mimetype') {
      return next(new AppError({ en: 'Only .jpg files are allowed!' }, 400));
    }

    if (!req.file) {
      return next(new AppError({ en: 'File missing or invalid!' }, 400));
    }

    next();
  });
};
