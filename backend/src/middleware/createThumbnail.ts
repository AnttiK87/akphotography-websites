// middleware for writing highres file to hard drive and then generates thubnail out of it.
import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs/promises';
import fsSync from 'fs';

import { handlePictureResize } from '../services/imageService.js';
import logger from '../utils/logger.js';

//function for creating upload folders if those doesn't exist
export const ensureFolders = (
  uploadFolderHighRes: string,
  uploadFolderThumbnail: string,
) => {
  [uploadFolderHighRes, uploadFolderThumbnail].forEach((folder) => {
    if (!fsSync.existsSync(folder)) {
      fsSync.mkdirSync(folder, { recursive: true });
    }
  });
};

//function for writing file to hard drive
export const writeToHardDrive = async (
  file: Express.Multer.File,
  uploadFolderHightRes: string,
) => {
  if (!file?.path && file?.buffer) {
    const extension = path.extname(file.originalname) || '.jpg';
    const filename = `${Date.now()}${extension}`;
    const filePath = path.join(uploadFolderHightRes, filename);

    await fs.writeFile(filePath, file.buffer);

    file.path = filePath;
    file.filename = filename;

    logger.info(`Saved file to disk: ${filePath}`);
  }
};

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
  ensureFolders(uploadFolderHightRes, uploadFolderThumbnail);

  // write file from memory to hard drive
  await writeToHardDrive(req.file, uploadFolderHightRes);

  // create and save thumbnail-file
  const thumbnail = await handlePictureResize(
    req.file.path,
    uploadFolderThumbnail,
  );

  // add thubnail data to req.file
  req.file.thumbnailFilename = thumbnail.filename;
  req.file.thumbnailPath = path.join(
    uploadBase,
    'thumbnail',
    thumbnail.filename,
  );
  logger.info(`Created thumbnail: ${req.file.thumbnailPath}`);

  next();
};
