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
};

jest.unstable_mockModule('../../src/services/userService.js', () => ({
  getUserById: jest.fn(),
}));

const { userExtractor } = await import('../../src/middleware/userExtractor.js');
const { getUserById } = await import('../../src/services/userService.js');

describe('userExtractor middleware', () => {
  it('throws AppError if token is missing', async () => {
    (getUserById as jest.Mock).mockResolvedValueOnce(fakeUser as never);

    const req = {} as TestRequest;
    const res = {} as Response;
    const next = jest.fn();

    await expect(userExtractor(req, res, next)).rejects.toThrow(AppError);
    await expect(userExtractor(req, res, next)).rejects.toThrow(
      'Token missing!',
    );
  });

  it('throws AppError if user is not found', async () => {
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

    await userExtractor(req, res, next);
    await expect(userExtractor(req, res, next)).rejects.toThrow(AppError);
    await expect(userExtractor(req, res, next)).rejects.toThrow(
      'User not found',
    );
  });

  it('calls next and attaches user when user is found', async () => {
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

    await userExtractor(req, res, next);

    expect(req.user).toEqual(fakeUser);
    expect(next).toHaveBeenCalled();
  });
});
