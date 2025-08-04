import type { Type } from "./types";

export type Metadata = {
  ExposureTime?: string;
  FNumber?: number;
  ISO?: number;
  LensModel?: string;
  FocalLength?: string;
  DateTimeOriginal?: string;
  Make?: string;
  Model?: string;
};

export interface PictureState {
  allPictures: PictureDetails[];
  monthly: PicturesBasic[];
  nature: PicturesBasic[];
  birds: PicturesBasic[];
  mammals: PicturesBasic[];
  landscapes: PicturesBasic[];
  latestCategoryPictures: PicturesBasic[];
}

export interface GalleryPicture {
  src: string;
  srcFullRes: string;
  width: number;
  height: number;
  id: number;
  uploadedAt: string;
  title?: string;
  keywords: PictureKeyword[];
  description?: string;
  order: number;
}

interface PictureText {
  textEn: string | null;
  textFi: string | null;
}

interface PictureKeyword {
  keyword: string;
}

export interface PictureRating {
  id: number;
  rating: number;
}

interface PictureReply {
  id: number;
}

interface PictureComment {
  id: number;
  replies: PictureReply[];
}

export interface PictureDetails {
  id: number;
  fileName: string;
  url: string;
  urlThumbnail: string;
  uploadedAt: string;
  width: number;
  height: number;
  type: Type;
  monthYear: number | null;
  viewCount: number;
  text: PictureText | null;
  keywords: PictureKeyword[];
  ratings: PictureRating[];
  comments: PictureComment[];
  order: number;
}

export type PictureOrder = {
  message: string;
  picture1: PictureDetails;
  picture2: null | PictureDetails;
};

export type PicturesBasic = Omit<PictureDetails, "comments">;

export type PictureAllDataResponse = PictureDetails[];

export type PicturesByCategoryResponse = PicturesBasic[];

export type PicturesAddViewResponse = PicturesBasic;

export type AddPictureResponse = {
  message: string;
  picture: PictureDetails;
};

interface PictureUpdate {
  month: number | null;
  year: number | null;
  keywords: string[] | null;
  textEn: string | undefined;
  textFi: string | undefined;
  type: Type;
}

export type UpdatePicture = {
  pictureId: number;
  formData: PictureUpdate;
};

export type UpdatePictureResponse = {
  message: string;
  picture: PictureDetails;
};
