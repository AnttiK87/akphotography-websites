import request from 'supertest';
import app from '../../src/app.js';

describe('POST /api/login', () => {
  test('should login successfully with correct credentials', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'admin', password: 'testadmin' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.username).toBe('admin');
  });

  test('should return 401 with wrong username', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'nonExistent', password: 'anyPassword' });

    expect(res.status).toBe(401);
    expect(res.body.token).toBeUndefined();
  });

  test('should return 401 with wrong password', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'admin', password: 'wrongPassword' });

    expect(res.status).toBe(401);
  });

  test('should return 400 if username is missing', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ password: 'somePassword' });

    expect(res.status).toBe(400);
  });

  test('should return 400 if password is missing', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'validUser' });

    expect(res.status).toBe(400);
  });

  test('should handle very long username and password gracefully', async () => {
    const longUsername = 'a'.repeat(300);
    const longPassword = 'b'.repeat(300);

    const res = await request(app)
      .post('/api/login')
      .send({ username: longUsername, password: longPassword });

    expect([400, 401]).toContain(res.status);
  });
});
