import request from 'supertest';
import app from '../../src/app.js';
import models from '../../src/models/index.js';
const { User } = models;

describe('User routes', () => {
  let token: string;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'admin', password: 'testadmin' });

    token = res.body.token;
  });

  afterAll(async () => {
    await User.destroy({ where: { username: 'newuser123' } });
    await request(app)
      .put('/api/users/updateInfo')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Administrator',
        username: 'admin',
        email: 'admin@example.com',
      })
      .expect(200);
    await request(app)
      .delete('/api/logout')
      .set('Authorization', `Bearer ${token}`);
  });

  test('GET /api/users returns all users', async () => {
    const res = await request(app).get('/api/users').expect(200);

    expect(res.body).toBeInstanceOf(Array);
    expect(res.body[0]).toHaveProperty('username');
  });

  test('POST /api/users/addUser creates user', async () => {
    const newUser = {
      name: 'Test User',
      username: 'newuser123',
      password: 'secUr3passw*rd',
      passwordConfirmation: 'secUr3passw*rd',
      email: 'new@example.com',
      role: 'user',
    };

    const res = await request(app)
      .post('/api/users/addUser')
      .set('Authorization', `Bearer ${token}`)
      .send(newUser)
      .expect(200);

    expect(res.body.user.username).toBe('newuser123');
  });

  test('PUT /api/users/updateInfo updates user info', async () => {
    const res = await request(app)
      .put('/api/users/updateInfo')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Name',
        username: 'admin',
        email: 'admin@example.com',
      })
      .expect(200);

    expect(res.body.user.name).toBe('Updated Name');
  });

  test('DELETE /api/users/:id deletes user', async () => {
    const user = await User.create({
      name: 'To Be Deleted',
      username: 'deleteuser',
      passwordHash: 'hash',
      email: 'del@example.com',
      role: 'user',
    });

    await request(app)
      .delete(`/api/users/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const deleted = await User.findByPk(user.id);
    expect(deleted).toBeNull();
  });

  test('POST /addUser fails with invalid password', async () => {
    const badUser = {
      name: 'User with invalid pw',
      username: 'baduser',
      password: 'salasana1',
      passwordConfirmation: 'salasana1',
      email: 'new_email',
      role: 'user',
    };

    const res = await request(app)
      .post('/api/users/addUser')
      .set('Authorization', `Bearer ${token}`)
      .send(badUser)
      .expect(400);

    const hasPasswordError = res.body.messages.some(
      (msg: { field: string; message: string }) =>
        /Password must include uppercase, lowercase, number, and symbol/i.test(
          msg.message,
        ),
    );
    expect(hasPasswordError).toBe(true);
  });
});
