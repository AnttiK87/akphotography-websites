import type { User } from '../models/user.js';
import type { Picture } from '../models/picture.js';
import type { Reply } from '../models/reply.js';
import type { Comment } from '../models/comment.js';
import type { Keyword } from '../models/keyword.js';
import type { JwtPayload } from 'jsonwebtoken';

export interface DecodedToken extends JwtPayload {
  id: number;
  token: string;
  name: string;
  username: string;
}

declare global {
  namespace Express {
    interface Request {
      keyword?: Keyword;
      picture?: Picture;
      reply?: Reply;
      comment?: Comment;
      user?: User;
      decodedToken?: DecodedToken;
      password?: string;
      passwordHash?: string;
      metadata: {
        width: number;
        height: number;
      };
      file: Express.Multer.File & {
        path: string;
        filename: string;
        thumbnailFilename: string;
        thumbnailPath: string;
      };
    }
  }
}

declare module 'multer' {
  interface File {
    path?: string;
    filename?: string;
    thumbnailFilename?: string;
    thumbnailPath?: string;
  }
}
