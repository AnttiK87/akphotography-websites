import 'multer';

declare module 'multer' {
  interface File {
    path: string;
    thumbnailPath: string;
    filename: string;
  }
}
