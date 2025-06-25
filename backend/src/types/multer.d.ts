import 'multer';

declare module 'multer' {
  interface File {
    path: string;
    filename: string;
  }
}
