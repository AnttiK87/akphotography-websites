import { jest } from '@jest/globals';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { writeToHardDrive } from '../../src/middleware/createThumbnail.js';
import logger from '../../src/utils/logger.js';

describe('writeToHardDrive integration test', () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const uploadFolder = path.join(__dirname, 'tmp_upload_test');

  beforeAll(async () => {
    await fs.mkdir(uploadFolder, { recursive: true });
  });

  afterAll(async () => {
    const files = await fs.readdir(uploadFolder);
    for (const file of files) {
      await fs.unlink(path.join(uploadFolder, file));
    }
    await fs.rmdir(uploadFolder);
  });

  test('writes file buffer to disk and updates file object', async () => {
    const mockFile = {
      originalname: 'test-image',
      buffer: Buffer.from('fake-image-data'),
      path: undefined,
      filename: undefined,
      fieldname: 'file',
      encoding: '7bit',
      mimetype: 'image/png',
      size: Buffer.from('fake-image-data').length,
      destination: '',
      stream: undefined,
    } as unknown as Express.Multer.File;

    await writeToHardDrive(mockFile, uploadFolder);

    expect(mockFile.path).toBeDefined();
    expect(mockFile.filename).toBeDefined();
    expect(mockFile.filename.endsWith('.jpg')).toBe(true);

    const writtenBuffer = await fs.readFile(mockFile.path);
    expect(writtenBuffer.equals(mockFile.buffer)).toBe(true);
  });

  test('does nothing if file.path already exists', async () => {
    const mockFile = {
      originalname: 'existing.jpg',
      buffer: Buffer.from('data'),
      path: path.join(uploadFolder, 'existing.jpg'),
      filename: 'existing.jpg',
      fieldname: 'file',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: Buffer.from('data').length,
      destination: '',
      stream: undefined,
    } as unknown as Express.Multer.File;

    const loggerSpy = jest.spyOn(logger, 'info');

    await writeToHardDrive(mockFile, uploadFolder);

    expect(loggerSpy).not.toHaveBeenCalled();
  });
});
