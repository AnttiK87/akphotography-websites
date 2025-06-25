import { picIncludeBasic } from '../utils/includeOptions.js';

import { handlePictureResize } from './imageService.js';

import Picture from '../models/picture.js';
import Text from '../models/text.js';

import { CreatePicture } from '../types/types.js';

export const getPictureById = async (id: string | number) => {
  return Picture.findByPk(id, {
    include: picIncludeBasic,
  });
};

export const getTextIfExist = async (textId: number | null) => {
  if (!textId) {
    return null;
  }
  return await Text.findByPk(textId);
};

export const saveText = async (
  pictureId: number,
  textFi: string | null,
  textEn: string | null,
) => {
  const cleanedTextFi = textFi ? textFi.trim() : null;
  const cleanedTextEn = textEn ? textEn.trim() : null;

  return Text.create({
    textFi: cleanedTextFi,
    textEn: cleanedTextEn,
    pictureId,
  });
};

export const createPicture = async ({
  filePath,
  filename,
  width,
  height,
  type,
  uploadFolderThumbnail,
}: CreatePicture) => {
  const thumbnail = await handlePictureResize(filePath, uploadFolderThumbnail);

  return await Picture.create({
    fileName: filename,
    url: `/uploads/pictures/${filename}`,
    urlThumbnail: `/uploads/thumbnail/${thumbnail.filename}`,
    type,
    width,
    height,
  });
};
