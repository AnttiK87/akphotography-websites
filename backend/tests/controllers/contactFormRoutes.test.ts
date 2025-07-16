import request from 'supertest';
import app from '../../src/app.js';

describe('Comment routes', () => {
  test('POST /api/contact calls email services', async () => {
    const contactData = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'Hello!',
      contactMe: true,
      language: 'eng',
    };

    const res = await request(app)
      .post('/api/contact')
      .send(contactData)
      .expect(200);

    expect(res.body.messageEn).toBe('Message sent successfully!');
  });

  test('POST /api/contact fails with missing name field', async () => {
    const contactData = {
      name: null,
      email: 'test@example.com',
      message: 'Hello!',
      contactMe: true,
    };

    const res = await request(app)
      .post('/api/contact')
      .send(contactData)
      .expect(400);

    expect(res.body.messages[0].field).toBe('name');
    expect(res.body.messages[0].message).toBe('Expected string, received null');
  });

  test('POST /api/contact fails with missing name field', async () => {
    const contactData = {
      name: 'Test User',
      email: null,
      message: 'Hello!',
      contactMe: true,
    };

    const res = await request(app)
      .post('/api/contact')
      .send(contactData)
      .expect(400);

    expect(res.body.messages[0].field).toBe('email');
    expect(res.body.messages[0].message).toBe('Expected string, received null');
  });

  test('POST /api/contact fails with missing name field', async () => {
    const contactData = {
      name: 'Test User',
      email: 'test@example.com',
      message: null,
      contactMe: true,
    };

    const res = await request(app)
      .post('/api/contact')
      .send(contactData)
      .expect(400);

    expect(res.body.messages[0].field).toBe('message');
    expect(res.body.messages[0].message).toBe('Expected string, received null');
  });

  test('POST /api/contact form send without language and contact me', async () => {
    const contactData = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'Hello!',
    };

    const res = await request(app)
      .post('/api/contact')
      .send(contactData)
      .expect(200);

    expect(res.body.messageEn).toBe('Message sent successfully!');
  });

  test('POST /api/contact form send with language fin', async () => {
    const contactData = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'Hello!',
    };

    const res = await request(app)
      .post('/api/contact')
      .send(contactData)
      .expect(200);

    expect(res.body.messageEn).toBe('Message sent successfully!');
  });
});
