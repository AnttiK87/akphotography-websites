import { jest } from '@jest/globals';
// Mock logger
const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
};

jest.unstable_mockModule('../../src/utils/logger.js', () => ({
  __esModule: true,
  default: mockLogger,
}));

const { deleteSessionByUserId } = await import(
  '../../src/services/sessionService.js'
);

beforeEach(() => {
  mockLogger.info.mockClear();
  mockLogger.error.mockClear();
});

describe('sessionService', () => {
  it('returns logger info if session not found', async () => {
    process.env.NODE_ENV = 'production';
    await deleteSessionByUserId(555);

    expect(mockLogger.error).toHaveBeenCalled();
    expect(mockLogger.error).toHaveBeenCalledWith(
      'Session not found for userId:',
      '555',
    );
  });
});
