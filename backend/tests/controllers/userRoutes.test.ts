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
    await request(app)
      .delete('/api/logout')
      .set('Authorization', `Bearer ${token}`);
    await User.destroy({ where: {} });
  });

  test('PUT /api/users/updateFirstLogin updates user info at first login', async () => {
    const newUser = {
      name: 'Test User 1',
      username: 'newuser1',
      email: 'new1@example.com',
      password: 'secUr3passw*rd',
      passwordConfirmation: 'secUr3passw*rd',
    };

    const res = await request(app)
      .put('/api/users/updateFirstLogin')
      .set('Authorization', `Bearer ${token}`)
      .send(newUser)
      .expect(200);

    expect(res.body.user.username).toBe('newuser1');
    expect(res.body.user.name).toBe('Test User 1');
  });

  test('GET /api/users returns all users', async () => {
    const res = await request(app).get('/api/users').expect(200);

    expect(res.body).toBeInstanceOf(Array);
    expect(res.body[0]).toHaveProperty('username');
  });

  test('POST /api/users/addUser creates user', async () => {
    const newUser = {
      name: 'Test User 2',
      username: 'newuser2',
      password: 'secUr3passw*rd',
      passwordConfirmation: 'secUr3passw*rd',
      email: 'new2@example.com',
      role: 'user',
    };

    const res = await request(app)
      .post('/api/users/addUser')
      .set('Authorization', `Bearer ${token}`)
      .send(newUser)
      .expect(200);

    expect(res.body.user.username).toBe('newuser2');
  });

  test('POST /api/users/addUser fails to create dublicate user', async () => {
    const newUser = {
      name: 'Test User 2',
      username: 'newuser2',
      password: 'secUr3passw*rd',
      passwordConfirmation: 'secUr3passw*rd',
      email: 'new2@example.com',
      role: 'user',
    };

    const res = await request(app)
      .post('/api/users/addUser')
      .set('Authorization', `Bearer ${token}`)
      .send(newUser)
      .expect(409);

    expect(res.body.error).toBe('Username must be unique');
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

  test('PUT /api/users/updateInfo updatefailf in no changes were provided', async () => {
    const res = await request(app)
      .put('/api/users/updateInfo')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Name',
        username: 'admin',
        email: 'admin@example.com',
      })
      .expect(400);

    expect(res.body.messages.fi).toBe('Et muuttanut tietoja');
    expect(res.body.messages.en).toBe('No changes provided');
  });

  test('PUT /api/users/updateInfo fails to updates user info with too short name', async () => {
    const res = await request(app)
      .put('/api/users/updateInfo')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Up',
        username: 'admin',
        email: 'admin@example.com',
      })
      .expect(400);

    expect(res.body.error).toBe('Validation error');
  });

  test('PUT /api/users/updateInfo fails to updates user info without name', async () => {
    const res = await request(app)
      .put('/api/users/updateInfo')
      .set('Authorization', `Bearer ${token}`)
      .send({
        username: 'admin',
        email: 'admin@example.com',
      })
      .expect(400);

    expect(res.body.error).toBe('Validation error');
  });

  test('PUT /api/users/changePassword updates user password', async () => {
    const res = await request(app)
      .put('/api/users/changePassword')
      .set('Authorization', `Bearer ${token}`)
      .send({
        newPassword1: 'secUr3passw*rd2',
        newPassword2: 'secUr3passw*rd2',
        oldPassword: 'secUr3passw*rd',
      })
      .expect(200);

    expect(res.body.messageEn).toBe('Password changed!');
  });

  test('PUT /api/users/changePassword fails to update user password with wrong old password', async () => {
    const res = await request(app)
      .put('/api/users/changePassword')
      .set('Authorization', `Bearer ${token}`)
      .send({
        newPassword1: 'secUr3passw*rd',
        newPassword2: 'secUr3passw*rd',
        oldPassword: 'secUr3passw*rd',
      })
      .expect(401);

    expect(res.body.messages.en).toBe('Invalid old password');
  });

  test('DELETE /api/users/:id deletes user', async () => {
    const user = await User.create({
      name: 'To Be Deleted',
      username: 'deleteuser',
      passwordHash: 'hash',
      email: 'del@example.com',
      role: 'user',
      profilePicture: '/images/about/profile-picture.jpg',
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
