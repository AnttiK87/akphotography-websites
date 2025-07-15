import { jest } from '@jest/globals';
import type { ResizedPicture } from '../../src/services/imageService.js';

jest.unstable_mockModule('../../src/services/imageService.js', () => ({
  handlePictureResize: (
    jest.fn() as jest.MockedFunction<
      (file: string, uploadFolderThumbnail: string) => Promise<ResizedPicture>
    >
  ).mockResolvedValue({ filename: 'thumb.jpg' }),
}));

const actual = await import('../../src/middleware/createThumbnail.js');

jest.unstable_mockModule('../../src/middleware/createThumbnail.js', () => ({
  ...actual,
  ensureFolders: jest.fn(),
  writeToHardDrive: jest.fn(),
}));

import path from 'path';
import { Request, Response } from 'express';

const { writeFileCreateThumbnail } = await import(
  '../../src/middleware/createThumbnail.js'
);

describe('writeFileCreateThumbnail', () => {
  test('should use test eviroment variables and add thumbnail info to req.file and call next', async () => {
    const mockFile = {
      originalname: 'test.jpg',
      buffer: Buffer.from('image data'),
      path: '/fake/path/image.jpg',
    };

    const req = { file: { ...mockFile } } as unknown as Request;
    const res = {} as Response;
    const next = jest.fn();

    process.env.NODE_ENV = 'test';

    await writeFileCreateThumbnail(req, res, next);

    expect(req.file.thumbnailFilename).toBe('thumb.jpg');
    expect(req.file.thumbnailPath).toBe(
      path.join('./tests/uploads/', 'thumbnail', 'thumb.jpg'),
    );

    expect(next).toHaveBeenCalled();
  });

  test('should use test eviroment variables and add thumbnail info to req.file and call next', async () => {
    const mockFile = {
      originalname: 'test.jpg',
      buffer: Buffer.from('image data'),
      path: '/fake/path/image.jpg',
    };

    const req = { file: { ...mockFile } } as unknown as Request;
    const res = {} as Response;
    const next = jest.fn();

    process.env.NODE_ENV = 'production';

    await writeFileCreateThumbnail(req, res, next);

    expect(req.file.thumbnailFilename).toBe('thumb.jpg');
    expect(req.file.thumbnailPath).toBe(
      path.join('./uploads/', 'thumbnail', 'thumb.jpg'),
    );

    expect(next).toHaveBeenCalled();
  });
});
