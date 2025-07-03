import request from 'supertest';
import app from '../../src/app.js';

test('POST /api/contact calls email services', async () => {
  const contactData = {
    name: 'Test User',
    email: 'test@example.com',
    message: 'Hello!',
    contactMe: true,
    language: 'en',
  };

  const res = await request(app)
    .post('/api/contact')
    .send(contactData)
    .expect(200);

  expect(res.body.messageEn).toBe('Message sent successfully!');
});
