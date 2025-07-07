import { upload } from '../utils/multerConfig.js';
import { Request, Response, NextFunction } from 'express';

const uploadSingleImage = upload.single('image');

export const handleUpload = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  uploadSingleImage(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        res
          .status(400)
          .json({ messages: { en: 'File too large, max file size 6MB' } });
        return;
      }

      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        res.status(400).json({
          messages: { en: 'Too many files! Only one file at a time!' },
        });
        return;
      }

      if (err instanceof Error) {
        res.status(400).json({ message: err.message });
        return;
      }

      return next(err);
    }

    if (!req.file) {
      res.status(400).json({
        messages: {
          en: 'File missing or invalid file type! Only .jpg files are allowed!',
        },
      });
      return;
    }
    next();
  });
};
