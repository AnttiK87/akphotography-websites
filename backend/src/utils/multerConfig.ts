// utils/multerConfig.ts
import multer from 'multer';
import fs from 'fs';
import path from 'path';

import logger from './logger.js';

// path for highResFiles
const isTestEnv = process.env.NODE_ENV === 'test';
const uploadBase = isTestEnv ? './tests/uploads/' : './uploads/';
const uploadFolderHightRes = path.join(uploadBase, 'pictures');
const uploadFolderThumbnail = path.join(uploadBase, 'thumbnail');

// if the folders do not exist, create them
[uploadFolderHightRes, uploadFolderThumbnail].forEach((folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
});

// configure multer
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadFolderHightRes);
  },
  filename: (_req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg'];
    if (allowed.includes(file.mimetype)) {
      logger.info('uploading file:', file.originalname);
      cb(null, true);
    } else {
      cb(new Error('Only .jpg files are allowed!'));
    }
  },
});

export { upload, uploadFolderHightRes, uploadFolderThumbnail };
