// utils/multerConfig.ts
// configure multer for upload file to memory with file type and size limit
import multer from 'multer';

const storage = multer.memoryStorage();
const allowed = ['image/jpg', 'image/jpeg', 'image/webp'];

const isTestEnv = process.env.NODE_ENV === 'test';
const fileSizeLimit = isTestEnv ? 5 * 1024 * 1024 : 30 * 1024 * 1024; // 5MB for test, 30MB for others

const upload = multer({
  storage,
  limits: { fileSize: fileSizeLimit },
  fileFilter: (req, file, cb) => {
    if (!allowed.includes(file.mimetype)) {
      req.fileValidationError = 'goes wrong on the mimetype';
      return cb(null, false);
    }
    cb(null, true);
  },
});

export { upload };
