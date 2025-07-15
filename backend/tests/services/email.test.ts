import { jest } from '@jest/globals';

const mockSendMail = jest.fn();

jest.unstable_mockModule('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: mockSendMail,
  })),
}));

// Mock logger
const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
};

jest.unstable_mockModule('../../src/utils/logger.js', () => ({
  __esModule: true,
  default: mockLogger,
}));

const { sendCommentNotification, sendContactNotification, sendAutoReply } =
  await import('../../src/services/emailService.js');

beforeEach(() => {
  mockSendMail.mockClear();
});

describe('emailService', () => {
  it('sendCommentNotification calls nodemailer, in production enviroment', async () => {
    process.env.NODE_ENV = 'production';
    await sendCommentNotification('testUser1', 1, 'test comment');

    expect(mockSendMail).toHaveBeenCalled();
    expect(mockLogger.info).toHaveBeenCalled();
    expect(mockLogger.info).toHaveBeenCalledWith('Email notification sent');
  });

  it('sendCommentNotification calls error logger if nodemailer returns error', async () => {
    const error = new Error('SMTP connection failed');
    mockSendMail.mockRejectedValue(error as never);

    process.env.NODE_ENV = 'production';
    await sendCommentNotification('testUser1', 1, 'test comment');

    expect(mockSendMail).toHaveBeenCalled();
    expect(mockLogger.error).toHaveBeenCalled();
    expect(mockLogger.error).toHaveBeenCalledWith(
      'Failed to send email notification:',
      'SMTP connection failed',
    );
  });

  it('sendCommentNotification calls error logger if nodemailer returns unknown error', async () => {
    const unknownError: unknown = 'some error';
    mockSendMail.mockRejectedValue(unknownError as never);

    process.env.NODE_ENV = 'production';
    await sendCommentNotification('testUser1', 1, 'test comment');

    expect(mockSendMail).toHaveBeenCalled();
    expect(mockLogger.error).toHaveBeenCalled();
    expect(mockLogger.error).toHaveBeenCalledWith(
      'Failed to send email notification:',
      'Unknown error',
    );
  });

  it('sendContactNotification calls nodemailer, in production enviroment', async () => {
    process.env.NODE_ENV = 'production';
    await sendContactNotification(
      'testUser1',
      'test@email.com',
      'test message',
      true,
    );

    expect(mockSendMail).toHaveBeenCalled();
    expect(mockLogger.info).toHaveBeenCalled();
    expect(mockLogger.info).toHaveBeenCalledWith('Email notification sent');
  });

  it('sendContactNotification calls error logger if nodemailer returns error', async () => {
    const error = new Error('SMTP connection failed');
    mockSendMail.mockRejectedValue(error as never);

    process.env.NODE_ENV = 'production';
    await sendContactNotification(
      'testUser1',
      'test@email.com',
      'test message',
      true,
    );

    expect(mockSendMail).toHaveBeenCalled();
    expect(mockLogger.error).toHaveBeenCalled();
    expect(mockLogger.error).toHaveBeenCalledWith(
      'Failed to send email notification:',
      'SMTP connection failed',
    );
  });

  it('sendContactNotification calls error logger if nodemailer returns unknown error', async () => {
    const unknownError: unknown = 'some error';
    mockSendMail.mockRejectedValue(unknownError as never);

    process.env.NODE_ENV = 'production';
    await sendContactNotification(
      'testUser1',
      'test@email.com',
      'test message',
      true,
    );

    expect(mockSendMail).toHaveBeenCalled();
    expect(mockLogger.error).toHaveBeenCalled();
    expect(mockLogger.error).toHaveBeenCalledWith(
      'Failed to send email notification:',
      'Unknown error',
    );
  });

  it('sendAutoReply calls sendmail, in production enviroment with finnish text parameter', async () => {
    process.env.NODE_ENV = 'production';
    await sendAutoReply('testUser1', 'test@email.com', true, 'fin');

    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        text: expect.stringContaining(
          'Pyrin vastaamaan sinulle mahdollisimman pian.',
        ),
      }),
    );
    expect(mockLogger.info).toHaveBeenCalled();
    expect(mockLogger.info).toHaveBeenCalledWith('Email notification sent');
  });

  it('sendAutoReply calls sendmail, in production enviroment with english text parameter', async () => {
    process.env.NODE_ENV = 'production';
    await sendAutoReply('testUser1', 'test@email.com', true, 'eng');

    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        text: expect.stringContaining(
          'I will get back to you as soon as possible.',
        ),
      }),
    );
  });

  it('sendAutoReply calls error logger if nodemailer returns error', async () => {
    const error = new Error('SMTP connection failed');
    mockSendMail.mockRejectedValue(error as never);

    process.env.NODE_ENV = 'production';
    await sendAutoReply('testUser1', 'test@email.com', false, 'fin');

    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        text: expect.stringContaining('Moi testUser1,\n\nMukavaa,'),
      }),
    );
    expect(mockLogger.error).toHaveBeenCalled();
    expect(mockLogger.error).toHaveBeenCalledWith(
      'Failed to send email notification:',
      'SMTP connection failed',
    );
  });

  it('sendAutoReply calls error logger if nodemailer returns unknown error', async () => {
    const unknownError: unknown = 'some error';
    mockSendMail.mockRejectedValue(unknownError as never);

    process.env.NODE_ENV = 'production';
    await sendAutoReply('testUser1', 'test@email.com', false, 'eng');

    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        text: expect.stringContaining('Hi testUser1,\n\nHow nice'),
      }),
    );
    expect(mockLogger.error).toHaveBeenCalled();
    expect(mockLogger.error).toHaveBeenCalledWith(
      'Failed to send email notification:',
      'Unknown error',
    );
  });
});
