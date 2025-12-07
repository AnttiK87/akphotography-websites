import express, { Request, Response } from 'express';
import fs from 'fs';
import fsSync from 'fs';
import path from 'path';
import sharp from 'sharp';
import logger from '../utils/logger.js';

import { tokenExtractor } from '../middleware/tokenExtractor.js';
import { handleUpload } from '../middleware/uploadMiddleware.js';
import { getPath } from '../utils/pathUtils.js';
import { AppError } from '../errors/AppError.js';

import { changeUiPicInput } from '../types/types.js';

const router = express.Router();

const isTestEnv = process.env.NODE_ENV === 'test';
const isDevEnv = process.env.NODE_ENV === 'development';
const folder = isTestEnv
  ? 'tests/uploads'
  : isDevEnv
    ? '/backend/public_html/uploads/'
    : 'public_html/uploads/';

// GET /api/uiComponents/homeBackground
// route for getting home screen background pictures
router.get('/homeBackground', async (_req: Request, res: Response) => {
  const uploadFolder = getPath(folder, 'images/homeBackground');

  const files = fs
    .readdirSync(uploadFolder)
    .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f));

  res.json({ count: files.length, files });
});

// PUT /api/uiComponents/changePic
// route for changing pictures on ui elements
// Middlewares used:
// - handleUpload: handles the file upload
// - tokenExtractor: validates the token and checks if the user is authenticated
// - userExtractor: extracts the user from the token
// - createNewProfPic: saves and resizes uploaded profile picture to server
// - handleProfPictureChange: updates new profile picture path to user info
router.put(
  '/changePic',
  tokenExtractor,
  handleUpload,
  async (req: Request<object, object, changeUiPicInput>, res: Response) => {
    const uploadFolder = getPath(folder, req.body.path);

    // create folders if they don't exist
    if (!fsSync.existsSync(uploadFolder)) {
      fsSync.mkdirSync(uploadFolder, { recursive: true });
    }

    // write file from memory to hard drive
    if (req.file?.buffer) {
      const filePath = path.join(uploadFolder, req.body.filename);

      // Process & save with Sharp
      await sharp(req.file.buffer).resize({ height: 700 }).toFile(filePath);

      logger.info(`Saved new picture to disk: ${filePath}`);
    }

    res.json({
      messageEn: 'Picture saved!',
      messageFi: 'Kuva tallenne!',
      picture: req.body.filename,
    });
  },
);

router.put(
  '/deletePic',
  tokenExtractor,
  async (req: Request, res: Response) => {
    const uploadFolder = getPath(folder, req.body.path);
    const filePath = path.join(uploadFolder, req.body.filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    } else {
      new AppError({ en: `File not found: ${filePath}` }, 400);
    }

    res.json({
      messageEn: 'Picture deleted!',
      messageFi: 'Kuva poistettu!',
      picture: req.body.filename,
    });
  },
);

export default router;
