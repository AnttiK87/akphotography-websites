import { jest } from '@jest/globals';

jest.unstable_mockModule('fs', () => ({
  default: {
    existsSync: jest.fn(),
    mkdirSync: jest.fn(),
  },
}));

const fs = (await import('fs')).default as unknown as {
  existsSync: jest.Mock;
  mkdirSync: jest.Mock;
};

const { ensureFolders } = await import(
  '../../src/middleware/createThumbnail.js'
);

describe('ensureFolders', () => {
  beforeEach(() => {
    fs.existsSync.mockReset();
    fs.mkdirSync.mockReset();
  });

  it('does not call mkdirSync if folder exist', () => {
    fs.existsSync.mockReturnValue(true);

    ensureFolders('tests/uploads/highres', 'tests/uploads/thumb');

    expect(fs.existsSync).toHaveBeenCalledTimes(2);
    expect(fs.mkdirSync).not.toHaveBeenCalled();
  });

  it('does call mkdirSync if folder does not exist', () => {
    fs.existsSync.mockReturnValue(false);

    ensureFolders('tests/uploads/highres', 'tests/uploads/thumb');

    expect(fs.mkdirSync).toHaveBeenCalledTimes(2);
    expect(fs.mkdirSync).toHaveBeenCalledWith('tests/uploads/highres', {
      recursive: true,
    });
    expect(fs.mkdirSync).toHaveBeenCalledWith('tests/uploads/thumb', {
      recursive: true,
    });
  });
});
