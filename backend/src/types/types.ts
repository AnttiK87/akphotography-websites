export enum AllowedSearch {
  Mammals = 'mammals',
  Landscapes = 'landscapes',
  Nature = 'nature',
  Birds = 'birds',
  Monthly = 'monthly',
}

export interface QueryParams {
  search?: AllowedSearch;
}

export interface QueryParamsId {
  search?: string;
}

// Define the interfaces for different request bodys
export interface CommentInput {
  comment: string;
  username: string;
  userId: string;
  pictureId: number;
}

export interface ReplyInput {
  reply: string;
  username: string;
  userId: string;
  commentId: number;
  pictureId: number;
  parentReplyId?: number;
  adminReply?: boolean;
}

export interface ContactFormInput {
  name: string;
  email: string;
  message: string;
  contactMe: boolean;
  language: string;
}

export interface KeywordInput {
  keyword: string;
}

export interface LoginInput {
  username: string;
  password: string;
}

// Define the interface for the request body
export interface PictureInput {
  filename: string;
  url: string;
  urlThumbnail: string;
  type: 'monthly' | 'birds' | 'nature' | 'landscapes' | 'mammals';
  width: number;
  height: number;
  textId?: number;
  month?: number;
  year?: number;
  textFi?: string | null;
  textEn?: string | null;
  keywords?: string | string[];
}

export interface CreatePicture {
  type: 'monthly' | 'birds' | 'nature' | 'landscapes' | 'mammals';
  width: number;
  height: number;
  uploadFolderThumbnail: string;
  filePath: string;
  filename: string;
}

export interface PictureUpdateInput {
  type: 'monthly' | 'birds' | 'nature' | 'landscapes' | 'mammals';
  textId?: number;
  month?: number;
  year?: number;
  textFi?: string | null;
  textEn?: string | null;
  keywords?: string | string[];
}

export interface UserInput {
  username: string;
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  role: string;
}

export interface UserInfoUpdateInput {
  username: string;
  name: string;
  email: string;
}

export interface UserFirstLoginInput {
  username: string;
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface passwordChangeInput {
  oldPassword: string;
  newPassword1: string;
  newPassword2: string;
}
