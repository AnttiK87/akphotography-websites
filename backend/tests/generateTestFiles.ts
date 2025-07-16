import fs from 'fs/promises'; // käytetään promisified versiota
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../src/utils/logger.js';

interface TestFile {
  name: string;
  size: number;
  description: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.resolve(__dirname, './fixtures');

const files: TestFile[] = [
  {
    name: 'test-large-img.jpg',
    size: 7 * 1024 * 1024, // 7 MB
    description: 'Too large image file',
  },
  {
    name: 'test-text-file.txt',
    size: 1024, // 1 KB
    description: 'Invalid file type',
  },
];

export const generateTestFiles = async (): Promise<void> => {
  await fs.mkdir(outputDir, { recursive: true });

  for (const file of files) {
    const filePath = path.join(outputDir, file.name);
    await fs.writeFile(filePath, Buffer.alloc(file.size));
    logger.info(
      `✔ Created ${file.name} (${file.description}, ${file.size} bytes)`,
    );
  }
};

export const cleanupTestFiles = async (): Promise<void> => {
  const filesToRemove = await fs.readdir(outputDir);
  for (const file of filesToRemove) {
    if (file != 'test-img.jpg') {
      const filePath = path.join(outputDir, file);
      await fs.unlink(filePath);
      logger.info(`🗑 Removed ${file}`);
    }
  }
};
