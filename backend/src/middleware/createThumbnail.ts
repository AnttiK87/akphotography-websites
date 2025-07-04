import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs/promises';
import fsSync from 'fs';

import { handlePictureResize } from '../services/imageService.js';
import logger from '../utils/logger.js';
import { AppError } from '../errors/AppError.js';

export const writeFileCreateThumbnail = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const isTestEnv = process.env.NODE_ENV === 'test';
  const uploadBase = isTestEnv ? './tests/uploads/' : './uploads/';
  const uploadFolderHightRes = path.join(uploadBase, 'pictures');
  const uploadFolderThumbnail = path.join(uploadBase, 'thumbnail');

  // create folders if they don't exist
  [uploadFolderHightRes, uploadFolderThumbnail].forEach((folder) => {
    if (!fsSync.existsSync(folder)) {
      fsSync.mkdirSync(folder, { recursive: true });
    }
  });

  // Jos tiedostoa ei ole vielä levyllä (esim. multer.memoryStorage())
  if (!req.file?.path && req.file?.buffer) {
    const filename = `${Date.now()}`;
    const filePath = path.join(uploadFolderHightRes, filename);

    await fs.writeFile(filePath, req.file.buffer);

    req.file.path = filePath;
    req.file.filename = filename;

    logger.info(`Saved file to disk: ${filePath}`);
  }

  if (!req.file || !req.file.path || !req.file.filename) {
    throw new AppError({ en: 'Writing file to disc failed!' }, 401);
  }

  const thumbnail = await handlePictureResize(
    req.file.path,
    uploadFolderThumbnail,
  );

  req.file.thumbnailFilename = thumbnail.filename;
  req.file.thumbnailPath = path.join(
    uploadBase,
    'thumbnail',
    thumbnail.filename,
  );
  logger.info(`Created thumbnail: ${req.file.thumbnailPath}`);

  next();
};
