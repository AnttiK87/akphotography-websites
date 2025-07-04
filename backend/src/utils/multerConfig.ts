// utils/multerConfig.ts
import multer from 'multer';

import { AppError } from '../errors/AppError.js';
import logger from './logger.js';

const storage = multer.memoryStorage();

// configure multer for upload file to memory with file type and size limit
const upload = multer({
  storage,
  limits: {
    fileSize: 6 * 1024 * 1024, // 6 MB limit
  },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg'];
    if (allowed.includes(file.mimetype)) {
      logger.info('uploading file:', file.originalname);
      cb(null, true);
    } else {
      throw new AppError({ en: 'Only .jpg files are allowed!' }, 401);
    }
  },
});

export { upload };
