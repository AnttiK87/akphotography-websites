import fs from 'fs';

import logger from './logger.js';

export const deleteFile = (filePath: string) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  } else {
    logger.info(`File not found: ${filePath}`);
  }
};
