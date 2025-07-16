import { jest } from '@jest/globals';
import { AppError } from '../../src/errors/AppError.js';
import type User from '../../src/models/user.js';
import type { Request, Response } from 'express';

interface TestRequest extends Request {
  user?: Partial<User>;
}

const fakeUser: Partial<User> = {
  id: 123,
  username: 'testuser',
  role: 'user',
};

const fakeUserAdmin: Partial<User> = {
  id: 124,
  username: 'testuser',
  role: 'admin',
};

jest.unstable_mockModule('../../src/services/userService.js', () => ({
  getUserById: jest.fn(),
}));
jest.unstable_mockModule('../../src/middleware/tokenExtractor.js', () => ({
  verifyToken: jest.fn(),
}));

const { validateIsAdmin } = await import(
  '../../src/middleware/validateAuthorisation.js'
);
const { validateOwner } = await import(
  '../../src/middleware/validateAuthorisation.js'
);
const { validateOwnerOrAdmin } = await import(
  '../../src/middleware/validateAuthorisation.js'
);

const { getUserById } = await import('../../src/services/userService.js');
const { verifyToken } = await import('../../src/middleware/tokenExtractor.js');

beforeEach(() => {
  jest.resetAllMocks();
});

describe('validateIsAdmin middleware', () => {
  test('throws AppError if token is missing', async () => {
    (getUserById as jest.Mock).mockResolvedValueOnce(fakeUser as never);

    const req = {} as TestRequest;
    const res = {} as Response;
    const next = jest.fn();

    await expect(validateIsAdmin(req, res, next)).rejects.toThrow(
      'Token missing!',
    );
    await expect(validateIsAdmin(req, res, next)).rejects.toThrow(AppError);
  });

  test('throws AppError if user is not found', async () => {
    (getUserById as jest.Mock).mockResolvedValueOnce(null as never);
    const req = {
      decodedToken: {
        id: 8646,
        token: 'string',
        name: 'string',
        username: 'string',
      },
    } as TestRequest;
    const res = {} as Response;
    const next = jest.fn();

    await expect(validateIsAdmin(req, res, next)).rejects.toThrow(
      'User not found',
    );
    await expect(validateIsAdmin(req, res, next)).rejects.toThrow(AppError);
  });

  test('throws AppError if user is not admin', async () => {
    (getUserById as jest.Mock).mockResolvedValueOnce(fakeUser as never);
    const req = {
      decodedToken: {
        id: 123,
        token: 'string',
        name: 'string',
        username: 'string',
      },
    } as TestRequest;
    const res = {} as Response;
    const next = jest.fn();

    await expect(validateIsAdmin(req, res, next)).rejects.toThrow(
      'Unauthorized!',
    );
    await expect(validateIsAdmin(req, res, next)).rejects.toThrow(AppError);
  });

  test('calls next and attaches user when user is admin', async () => {
    (getUserById as jest.Mock).mockResolvedValueOnce(fakeUserAdmin as never);

    const req = {
      decodedToken: {
        id: 124,
        token: 'string',
        name: 'string',
        username: 'string',
      },
    } as TestRequest;
    const res = {} as Response;
    const next = jest.fn();

    await validateIsAdmin(req, res, next);

    expect(req.user).toEqual(fakeUserAdmin);
    expect(next).toHaveBeenCalled();
  });
});

describe('validateOwner middleware', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('throws AppError if resource is missing', async () => {
    const req = {} as TestRequest;
    const res = {} as Response;
    const next = jest.fn();

    const middleware = validateOwner('comment');
    try {
      await middleware(req, res, next);
    } catch (err) {
      const error = err as AppError;
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toContain('Missing resource: comment');
    }
  });

  test('throws AppError if user is not owner', async () => {
    const req = {
      body: { userId: 2 },
      comment: { userId: 1 },
    } as unknown as Request;
    const res = {} as Response;
    const next = jest.fn();

    const middleware = validateOwner('comment');
    try {
      await middleware(req, res, next);
    } catch (err) {
      const error = err as AppError;
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toContain('Unauthorized to update this comment');
    }
  });

  test('calls next when user is owner', async () => {
    (getUserById as jest.Mock).mockResolvedValueOnce(fakeUserAdmin as never);

    const req = {
      body: { userId: 2 },
      comment: { userId: 2 },
    } as unknown as Request;
    const res = {} as Response;
    const next = jest.fn();

    const middleware = validateOwner('comment');
    await middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});

describe('validateOwnerOrAdmin middleware', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('throws AppError if resource is missing', async () => {
    const req = {} as TestRequest;
    const res = {} as Response;
    const next = jest.fn();

    const middleware = validateOwnerOrAdmin('comment');
    try {
      await middleware(req, res, next);
    } catch (err) {
      const error = err as AppError;
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toContain('Missing resource: comment');
    }
  });

  test('throws AppError if token is missing', async () => {
    (getUserById as jest.Mock).mockResolvedValueOnce(fakeUser as never);
    (verifyToken as jest.Mock).mockResolvedValueOnce(null as never);

    const req = {
      comment: { userId: 2 },
      body: { userId: 1 },
      get: jest.fn().mockReturnValue('Bearer faketoken'),
    } as unknown as TestRequest;
    const res = {} as Response;
    const next = jest.fn();

    const middleware = validateOwnerOrAdmin('comment');
    try {
      await middleware(req, res, next);
    } catch (err) {
      const error = err as AppError;
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toContain('Token missing!');
    }
  });

  test('throws AppError if user is not found', async () => {
    (getUserById as jest.Mock).mockResolvedValueOnce(null as never);
    (verifyToken as jest.Mock).mockResolvedValueOnce({
      id: 123,
    } as never);

    const req = {
      comment: { userId: 2 },
      body: { userId: 1 },
      get: jest.fn().mockReturnValue('Bearer faketoken'),
    } as unknown as TestRequest;
    const res = {} as Response;
    const next = jest.fn();

    const middleware = validateOwnerOrAdmin('comment');
    try {
      await middleware(req, res, next);
    } catch (err) {
      const error = err as AppError;
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toContain('User not found');
    }
  });

  test('throws AppError if user is not owner or admin', async () => {
    (getUserById as jest.Mock).mockResolvedValueOnce(fakeUser as never);
    (verifyToken as jest.Mock).mockResolvedValueOnce({
      id: 123,
    } as never);
    const req = {
      body: { userId: 2 },
      comment: { userId: 1 },
      get: jest.fn().mockReturnValue('Bearer faketoken'),
    } as unknown as Request;
    const res = {} as Response;
    const next = jest.fn();

    const middleware = validateOwnerOrAdmin('comment');
    try {
      await middleware(req, res, next);
    } catch (err) {
      const error = err as AppError;
      expect(error).toBeInstanceOf(AppError);
      expect(error.messages.en).toBe('Unauthorized to delete this comment');
    }
  });

  test('calls next when user is owner', async () => {
    const req = {
      body: { userId: 1 },
      comment: { userId: 1 },
    } as unknown as Request;
    const res = {} as Response;
    const next = jest.fn();

    const middleware = validateOwnerOrAdmin('comment');
    await middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('calls next when user is admin', async () => {
    (getUserById as jest.Mock).mockResolvedValueOnce(fakeUserAdmin as never);
    (verifyToken as jest.Mock).mockResolvedValueOnce({
      id: 124,
    } as never);

    const req = {
      body: { userId: 1 },
      comment: { userId: 2 },
      get: jest.fn().mockReturnValue('Bearer faketoken'),
    } as unknown as Request;
    const res = {} as Response;
    const next = jest.fn();

    const middleware = validateOwnerOrAdmin('comment');
    await middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
