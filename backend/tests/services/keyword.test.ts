import { jest } from '@jest/globals';
import { attachKeywordsToPicture } from '../../src/services/keywordService.js';
import Picture from '../../src/models/picture.js';

describe('keywordService', () => {
  test('attachKeywordsToPicture returns early keywords were not provided', async () => {
    const mockSetKeywords = jest.fn();

    const picture = {
      id: 1,
      fileName: 'test.jpg',
      url: '/uploads/picture/test.jpg',
      type: 'birds',
      monthYear: null,
      setKeywords: mockSetKeywords,
    } as unknown as Picture;

    await attachKeywordsToPicture(picture, undefined);
    expect(mockSetKeywords).not.toHaveBeenCalled();
  });
});
