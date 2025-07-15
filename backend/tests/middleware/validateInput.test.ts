import { jest } from '@jest/globals';

const mockMetadata = jest.fn();

jest.unstable_mockModule('sharp', () => {
  return {
    default: jest.fn(() => ({
      metadata: mockMetadata,
    })),
  };
});

import { AppError } from '../../src/errors/AppError.js';
const { validatePictureUploadInput } = await import(
  '../../src/middleware/validateInput.js'
);
import type Picture from '../../src/models/picture.js';
import type { Request, Response } from 'express';

interface TestRequest extends Request {
  user?: Partial<Picture>;
}

describe('validatePictureUploadInput middleware', () => {
  test('throws AppError if req.file is missing', async () => {
    const req = { body: { type: 'birds' } } as TestRequest;
    const res = {} as Response;
    const next = jest.fn();

    await expect(validatePictureUploadInput(req, res, next)).rejects.toThrow(
      'File info missing!',
    );
    await expect(validatePictureUploadInput(req, res, next)).rejects.toThrow(
      AppError,
    );
  });

  test('throws AppError if metadata is missing', async () => {
    mockMetadata.mockResolvedValueOnce(null as never);
    const req = {
      body: { type: 'birds' },
      file: {
        path: 'invalid',
        filename: 'invalid',
        thumbnailFilename: 'invalid',
      },
    } as TestRequest;
    const res = {} as Response;
    const next = jest.fn();

    await expect(validatePictureUploadInput(req, res, next)).rejects.toThrow(
      'Could not read image dimensions',
    );
    await expect(validatePictureUploadInput(req, res, next)).rejects.toThrow(
      AppError,
    );
  });
});
