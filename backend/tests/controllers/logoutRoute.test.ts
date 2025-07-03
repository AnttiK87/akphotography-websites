import request from 'supertest';
import app from '../../src/app.js';

import jwt from 'jsonwebtoken';
import { setSession } from '../../src/services/sessionService.js';

describe('DELETE /api/logout with correct token', () => {
  let token: string;

  beforeEach(async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'admin', password: 'testadmin' });

    token = res.body.token;
  });

  test('should cancel first login successfully', async () => {
    const res = await request(app)
      .delete('/api/logout/cancelFirstLogin')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Login canceled');
  });

  test('should logout successfully', async () => {
    const res = await request(app)
      .delete('/api/logout')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Logged out successfully');
  });

  test('should return 401 with no token', async () => {
    const res = await request(app).delete('/api/logout');

    expect(res.status).toBe(401);
    expect(res.body.messages.en).toBe('Token missing');
  });

  test('should return 401 if not loggedin', async () => {
    const res = await request(app)
      .delete('/api/logout')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Logged out successfully');

    const notLoggedIn = await request(app)
      .delete('/api/logout')
      .set('Authorization', `Bearer ${token}`);
    expect(notLoggedIn.status).toBe(401);
    expect(notLoggedIn.body.messages.en).toBe('You are not logged in');
  });
});

describe('DELETE /api/logout with invalid token', () => {
  const fakeSignedToken = jwt.sign({ id: 1 }, 'WRONG_SECRET');
  beforeEach(async () => {
    await setSession(1, fakeSignedToken);
  });

  test('should return 401 with invalid token', async () => {
    const res = await request(app)
      .delete('/api/logout')
      .set('Authorization', `Bearer ${fakeSignedToken}`);

    expect(res.status).toBe(401);
    expect(res.body.messages.en).toBe('Invalid token');
  });
});
