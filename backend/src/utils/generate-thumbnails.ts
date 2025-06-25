// generate-thumbnails.ts is a script that generates thumbnails for
// images already stored on the server. It uses the sharp library
// to resize images and save them in a different format. The script
// connects to a database to retrieve image records and updates them
// with the generated thumbnail URLs and generates thumbnail file to server.

// Made this script after realizing that it is not good practise to use full res images as thumbnails.
// This script is intended to be run as a standalone process, not as part of the main application.

import { basename, extname, join } from 'path';
import { existsSync } from 'fs';
import sharp from 'sharp';
import Picture from '../models/picture.js';
import { sequelize } from './db.js';

//upload folders
const uploadFolderHighRes = './uploads/pictures/';
const uploadFolderThumbnail = './uploads/thumbnail/';

// Function to generate a thumbnail for a given image file
const generateThumbnail = async (
  filePath: string,
  originalFilename: string,
) => {
  // filename without extension
  const nameWithoutExt = basename(originalFilename, extname(originalFilename));
  // create fielename for thumbnail
  const thumbnailName = nameWithoutExt + '.webp';
  // create path for thumbnail
  const outputPath = join(uploadFolderThumbnail, thumbnailName);

  // use sharp to resize the image and convert it to webp format
  await sharp(filePath)
    .resize({ height: 600 })
    .toFormat('webp')
    .toFile(outputPath);

  // return the URL of the thumbnail
  return `/uploads/thumbnail/${thumbnailName}`;
};

const run = async () => {
  try {
    // Check if the upload folders exist
    if (!existsSync(uploadFolderHighRes)) {
      console.error(`High-res folder not found: ${uploadFolderHighRes}`);
      process.exit(1);
    }

    if (!existsSync(uploadFolderThumbnail)) {
      console.error(`Thumbnail folder not found: ${uploadFolderThumbnail}`);
      process.exit(1);
    }

    // connect to the database
    await sequelize.authenticate();
    console.warn('Connected to database.');

    // find all pictures in the database
    const pictures = await Picture.findAll();

    // loop through all pictures and generate thumbnails
    for (const pic of pictures) {
      try {
        // if picture data doesn't have a thumbnail URL, generate one
        if (!pic.urlThumbnail) {
          // path to the high-res image
          const fullPath = join(uploadFolderHighRes, pic.fileName);

          // if the file exists generate a thumbnail
          if (existsSync(fullPath)) {
            const thumbnailUrl = await generateThumbnail(
              fullPath,
              pic.fileName,
            );
            //save thumbnail url to the db
            pic.urlThumbnail = thumbnailUrl;
            await pic.save();
            console.warn(`Thumbnail created for ${pic.fileName}`);
          } else {
            console.warn(`⚠ File not found: ${fullPath}`);
          }
        } else {
          console.warn(`Thumbnail already exists for ${pic.fileName}`);
        }
      } catch (err) {
        console.error(`Error processing ${pic.fileName}:`, err);
      }
    }

    console.warn('All thumbnails generated.');
    await sequelize.close();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

run();
