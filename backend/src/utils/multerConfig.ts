// utils/multerConfig.ts
// configure multer for upload file to memory with file type and size limit
import multer from 'multer';

const storage = multer.memoryStorage();
const allowed = ['image/jpeg', 'image/webp'];

const upload = multer({
  storage,
  limits: { fileSize: 6 * 1024 * 1024 }, // 6MB
  fileFilter: (req, file, cb) => {
    if (!allowed.includes(file.mimetype)) {
      req.fileValidationError = 'goes wrong on the mimetype';
      return cb(null, false);
    }
    cb(null, true);
  },
});

export { upload };
