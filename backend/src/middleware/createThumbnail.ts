import { Request, Response, NextFunction } from 'express';
import { handlePictureResize } from '../services/imageService.js';
import { uploadFolderThumbnail } from '../utils/multerConfig.js';
import path from 'path';

export const createThumbnail = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  if (!req.file?.path) {
    return next();
  }

  const thumbnail = await handlePictureResize(
    req.file.path,
    uploadFolderThumbnail,
  );

  req.file.thumbnailFilename = thumbnail.filename;
  req.file.thumbnailPath = path.join(
    'uploads',
    'thumbnail',
    thumbnail.filename,
  );
  next();
};
