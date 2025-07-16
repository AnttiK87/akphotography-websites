import path from 'path';
import sharp from 'sharp';

// Define the interface for the resized picture
export interface ResizedPicture {
  filename: string;
}

// function to generate smaller version of the image and change the format to webp
export const handlePictureResize = async (
  file: string,
  uploadFolderThumbnail: string,
): Promise<ResizedPicture> => {
  const nameWithoutExt = path.basename(file, path.extname(file));
  const filename = nameWithoutExt + '.webp';
  const fullPath = path.join(uploadFolderThumbnail, filename);

  //using sharp-library to resize the image
  await sharp(file).resize({ height: 600 }).toFormat('webp').toFile(fullPath);

  return { filename };
};
