// utils/multerConfig.ts
// configure multer for upload file to memory with file type and size limit
import multer from 'multer';

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 6 * 1024 * 1024 }, // 6MB
  fileFilter: (_req, file, cb) => {
    cb(null, file.mimetype == 'image/jpeg');
  },
});

export { upload };
