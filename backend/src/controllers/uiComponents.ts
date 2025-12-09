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

import { changeUiPicInput, UiTextInput } from '../types/types.js';

import { uiTextFinder } from '../middleware/finders.js';

import UiText from '../models/uiTexts.js';

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
router.get('/getPictures', async (req: Request, res: Response) => {
  const path: string = String(req.query.path) || 'images/homeBackground';
  const uploadFolder = getPath(folder, path);

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

// GET /api/uiComponents/uiTexts
//route for getting all users
router.get('/uiTexts', async (_req: Request, res: Response) => {
  const uiTexts = await UiText.findAll();
  res.json(uiTexts);
});

router.post(
  '/addUiText',
  tokenExtractor,
  async (req: Request<object, object, UiTextInput>, res: Response) => {
    const { key_name, screen, language, content, role } = req.body;

    const newUiText = await UiText.create({
      key_name,
      screen,
      language,
      content,
      role,
    });

    res.json({
      messageEn: 'New UiText added!',
      messageFi: 'Uusi teksti lisätty!',
      uiText: newUiText,
    });
  },
);

// PUT /api/users/updateInfo
// route for changing user info
// Middlewares used:
// - tokenExtractor: validates the token and checks if the user is authenticated
// - userExtractor: extracts the user from the token
// - handleUserInfoChange: handles the updated user info
router.put(
  '/updateUiText',
  tokenExtractor,
  uiTextFinder,
  async (req: Request<object, object, UiTextInput>, res: Response) => {
    const { content } = req.body;
    const uiText: UiText = req.uiText;

    if (content !== req.uiText.content) {
      throw new AppError(
        { fi: 'Et muuttanut tietoja', en: 'No changes provided' },
        400,
      );
    }

    uiText.content = content;
    const updatedUiText = await uiText.save();

    res.json({
      messageEn: `${updatedUiText.key_name} text edited!`,
      messageFi: `${updatedUiText.key_name} tekstiä muokattu!`,
      uiText: updatedUiText,
    });
  },
);

export default router;
