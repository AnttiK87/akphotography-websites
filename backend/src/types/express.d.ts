import { User } from '../models/user.js';
import { Picture } from '../models/picture.js';
import { Reply } from '../models/reply.js';
import { Comment } from '../models/reply.js';
import { Keyword } from '../models/keyword.js';

export interface AuthenticatedRequest extends Request {
  decodedToken: DecodedToken;
}

export interface DecodedToken extends JwtPayload {
  id: number;
  token: string;
  name: string;
  username: string;
}

// Extend the Express Request interface
declare global {
  namespace Express {
    interface Request {
      keyword: Keyword;
      picture: Picture;
      reply: Reply;
      comment: Comment;
      user: User;
      decodedToken: DecodedToken;
      password: string;
      passwordHash: string;
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
