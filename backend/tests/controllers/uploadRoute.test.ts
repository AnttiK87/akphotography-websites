import request from 'supertest';
import fs from 'fs';
import path from 'path';

describe('GET /uploads/:filename', () => {
  const testImagePath1 = path.resolve(
    '../public_html/uploads/test/test-image.jpg',
  );
  const testImagePath2 = path.resolve('tests/uploads/test/test-image.jpg');
  const originalEnv = process.env.NODE_ENV;

  beforeAll(() => {
    if (!fs.existsSync('../public_html/uploads/test/'))
      fs.mkdirSync('../public_html/uploads/test/', { recursive: true });
    fs.writeFileSync(testImagePath1, 'dummy content');

    if (!fs.existsSync('tests/uploads/test/'))
      fs.mkdirSync('tests/uploads/test/', { recursive: true });
    fs.writeFileSync(testImagePath2, 'dummy content');
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  afterAll(() => {
    fs.unlinkSync(testImagePath1);
    fs.unlinkSync(testImagePath2);
    fs.rmdirSync('../public_html/', { recursive: true });
    fs.rmdirSync('tests/uploads/test/');
  });

  test('should serve file from uploads in prod env', async () => {
    process.env.NODE_ENV = 'production';
    const { default: app } = await import(
      `../../src/app.js?prod=${Date.now()}`
    );
    const res = await request(app).get('/uploads/test/test-image.jpg');
    const expectedBuffer = fs.readFileSync(testImagePath1);

    expect(res.status).toBe(200);
    expect(res.header['content-type']).toBe('image/jpeg');
    expect(Buffer.compare(res.body, expectedBuffer)).toBe(0);
  });

  test('should serve file from uploads in test env', async () => {
    process.env.NODE_ENV = 'test';
    const { default: app } = await import(
      `../../src/app.js?test=${Date.now()}`
    );
    const res = await request(app).get('/uploads/test/test-image.jpg');
    const expectedBuffer = fs.readFileSync(testImagePath2);

    expect(res.status).toBe(200);
    expect(res.header['content-type']).toBe('image/jpeg');
    expect(Buffer.compare(res.body, expectedBuffer)).toBe(0);
  });
});
