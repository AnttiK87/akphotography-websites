// middleware for writing highres file to hard drive and then generates thubnail out of it.
import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs/promises';
import fsSync from 'fs';
import sharp from 'sharp';
import { getPath } from '../utils/pathUtils.js';
import { AppError } from '../errors/AppError.js';

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
  if (file?.buffer) {
    const metadata = await sharp(file.buffer).metadata();
    const { width, height } = metadata;

    const extension = path.extname(file.originalname) || '.jpg';
    const filename = `${Date.now()}${extension}`;
    const filePath = path.join(uploadFolderHightRes, filename);

    if (!width || !height) {
      await fs.writeFile(filePath, file.buffer);
      file.path = filePath;
      file.filename = filename;

      logger.info(`Saved file to disk: ${filePath}`);
      return;
    }

    const shortEdge = Math.min(width, height);

    if (shortEdge < 2000) {
      throw new AppError(
        {
          en: 'Picture is too small, min size for the shortest edge is 2000px',
        },
        400,
      );
    }

    const scale = 2000 / shortEdge;

    const resizeWidth = Math.round(width * scale);
    const resizeHeight = Math.round(height * scale);

    await sharp(file.buffer)
      .resize(resizeWidth, resizeHeight)
      .withMetadata()
      .toFile(filePath);

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
  const isDevEnv = process.env.NODE_ENV === 'development';
  const uploadBase = isTestEnv
    ? './tests/uploads/'
    : isDevEnv
      ? '/backend/public_html/uploads/'
      : '/public_html/uploads/';
  const uploadFolderHightRes = getPath(uploadBase, 'pictures');
  const uploadFolderThumbnail = getPath(uploadBase, 'thumbnail');

  // create folders if they don't exist
  ensureFolders(uploadFolderHightRes, uploadFolderThumbnail);

  // write file from memory to hard drive
  await writeToHardDrive(req.file, uploadFolderHightRes);

  // create and save thumbnail-file
  const thumbnail = await handlePictureResize(
    req.file.path,
    uploadFolderThumbnail,
  );

  // add thumbnail data to req.file
  req.file.thumbnailFilename = thumbnail.filename;
  req.file.thumbnailPath = path.join(
    uploadBase,
    'thumbnail',
    thumbnail.filename,
  );
  logger.info(`Created thumbnail: ${req.file.thumbnailPath}`);

  next();
};

export const writeNewProfPic = async (
  file: Express.Multer.File,
  username: string,
  uploadFolderProfPic: string,
) => {
  if (file?.buffer) {
    const extension = '.webp';
    const filename = `profile-picture-${username}${extension}`;
    const filePath = path.join(uploadFolderProfPic, filename);

    // Process & save with Sharp
    await sharp(file.buffer)
      .resize({ height: 300, width: 300 })
      .toFile(filePath);

    file.path = filePath;
    file.filename = filename;

    logger.info(`Saved new profile picture to disk: ${filePath}`);
  }
};

export const createNewProfPic = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const isTestEnv = process.env.NODE_ENV === 'test';
  const isDevEnv = process.env.NODE_ENV === 'development';
  const uploadBase = isTestEnv
    ? './tests/uploads/'
    : isDevEnv
      ? '/backend/public_html/uploads/'
      : '/public_html/uploads/';

  const uploadFolder = getPath(uploadBase, 'profile-pictures');

  // create folders if they don't exist
  if (!fsSync.existsSync(uploadFolder)) {
    fsSync.mkdirSync(uploadFolder, { recursive: true });
  }

  // write file from memory to hard drive
  await writeNewProfPic(req.file, req.user.username, uploadFolder);

  next();
};
