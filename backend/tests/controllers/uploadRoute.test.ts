import request from 'supertest';
import fs from 'fs';
import path from 'path';

describe('GET /uploads/:filename', () => {
  const testImagePath1 = path.resolve('src/uploads/test-image.jpg');
  const testImagePath2 = path.resolve('uploads/test/test-image.jpg');
  const originalEnv = process.env.NODE_ENV;

  beforeAll(() => {
    // Luo dummy-tiedosto testiksi
    if (!fs.existsSync('src/uploads/'))
      fs.mkdirSync('src/uploads/', { recursive: true });
    fs.writeFileSync(testImagePath1, 'dummy content');

    if (!fs.existsSync('uploads/test/'))
      fs.mkdirSync('uploads/test/', { recursive: true });
    fs.writeFileSync(testImagePath2, 'dummy content');
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  afterAll(() => {
    fs.unlinkSync(testImagePath1);
    fs.unlinkSync(testImagePath2);
    fs.rmdirSync('src/uploads/');
    fs.rmdirSync('uploads/test/');
  });

  it('should serve file from uploads in prod env', async () => {
    process.env.NODE_ENV = 'production';
    const { default: app } = await import(
      `../../src/app.js?prod=${Date.now()}`
    );
    const res = await request(app).get('/uploads/test-image.jpg');
    const expectedBuffer = fs.readFileSync(testImagePath1);

    expect(res.status).toBe(200);
    expect(res.header['content-type']).toBe('image/jpeg');
    expect(Buffer.compare(res.body, expectedBuffer)).toBe(0);
  });

  it('should serve file from uploads in test env', async () => {
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
