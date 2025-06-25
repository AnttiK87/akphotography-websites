import fs from 'fs';

export const deleteFile = (filePath: string) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  } else {
    console.warn(`File not found: ${filePath}`);
  }
};
