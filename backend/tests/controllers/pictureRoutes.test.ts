import request from 'supertest';
import path from 'path';
import { fileURLToPath } from 'url';

import app from '../../src/app.js';
import models from '../../src/models/index.js';
const { Picture } = models;

describe('Picture routes', () => {
  let token: string;
  let pictures: InstanceType<typeof Picture>[];

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'admin', password: 'testadmin' });

    token = res.body.token;
    pictures = await Picture.bulkCreate([
      {
        fileName: 'test-picture1.jpg',
        url: '/uploads/pictures/test-picture1.jpg',
        urlThumbnail: '/uploads/thumbnail/test-picture1.webp',
        height: 3000,
        width: 2000,
        type: 'birds',
        monthYear: null,
        viewCount: 4,
      },
      {
        fileName: 'testi-picture2.jpg',
        url: '/uploads/pictures/test-picture2.jpg',
        urlThumbnail: '/uploads/thumbnail/test-picture2.webp',
        height: 3000,
        width: 2000,
        type: 'landscapes',
        monthYear: null,
        viewCount: 4,
      },
      {
        fileName: 'test-picture3.jpg',
        url: '/uploads/pictures/test-picture3.jpg',
        urlThumbnail: '/uploads/thumbnail/test-picture3.webp',
        height: 3000,
        width: 2000,
        type: 'nature',
        monthYear: null,
        viewCount: 4,
      },
      {
        fileName: 'testi-picture4.jpg',
        url: '/uploads/pictures/test-picture4.jpg',
        urlThumbnail: '/uploads/thumbnail/test-picture4.webp',
        height: 3000,
        width: 2000,
        type: 'mammals',
        monthYear: null,
        viewCount: 4,
      },
    ]);
  });

  afterAll(async () => {
    await Picture.destroy({ where: { id: pictures[0].id } });
    await Picture.destroy({ where: { id: pictures[1].id } });
    await Picture.destroy({ where: { id: pictures[2].id } });
    await Picture.destroy({ where: { id: pictures[3].id } });
  });

  test('GET /api/pictures returns basic picture data', async () => {
    const res = await request(app).get('/api/pictures').expect(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).not.toHaveProperty('textId');
  });

  test('GET /api/pictures/allData returns all picture data', async () => {
    const res = await request(app).get('/api/pictures/allData').expect(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body[0]).toHaveProperty('keywords');
  });

  test('GET /api/pictures/latest returns latest 3 pictures', async () => {
    const res = await request(app).get('/api/pictures/latest').expect(200);
    expect(res.body.length).toBe(3);
  });

  test('PUT /api/pictures/addView/:id increases viewCount', async () => {
    const res = await request(app)
      .put(`/api/pictures/addView/${pictures[0].id}`)
      .expect(200);

    expect(res.body.viewCount).toBe(pictures[0].viewCount + 1);
  });

  test('PUT /api/pictures/:id adds text to picture', async () => {
    const updatedPicture = {
      type: 'birds',
      textFi: 'testi',
    };
    const res = await request(app)
      .put(`/api/pictures/${pictures[0].id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedPicture)
      .expect(200);

    expect(res.body.message).toBe('Picture updated!');
    expect(res.body.picture.text.textFi).toBe('testi');
    expect(res.body.picture.text.textEn).toBe(null);
  });

  test('PUT /api/pictures/:id updates picture to type monthly with month and year', async () => {
    const res = await request(app)
      .put(`/api/pictures/${pictures[0].id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ type: 'monthly', month: '01', year: '2025' })
      .expect(200);

    expect(res.body.picture.type).toBe('monthly');
  });

  test('PUT /api/pictures/:id update fails without valid token', async () => {
    const res = await request(app)
      .put(`/api/pictures/${pictures[0].id}`)
      .set('Authorization', `Bearer ${token}1`)
      .send({ type: 'monthly', month: '01', year: '2025' })
      .expect(401);

    expect(res.body.messages.en).toBe('You are not logged in');
  });

  test('PUT /api/pictures/:id update to monthly fails without month', async () => {
    const res = await request(app)
      .put(`/api/pictures/${pictures[1].id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ type: 'monthly', year: '2025' })
      .expect(400);

    expect(res.body.messages.en).toBe(
      'Year and month required for monthly pictures',
    );
  });

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  let testImageId: number;

  test('POST /api/pictures/upload uploads picture with metadata', async () => {
    const res = await request(app)
      .post('/api/pictures/upload')
      .set('Authorization', `Bearer ${token}`)
      .field('type', 'monthly')
      .field('month', '01')
      .field('year', '2025')
      .field('textFi', 'testi')
      .field('keywords', 'testi1,testi2,testi3,testi4')
      .attach('image', path.resolve(__dirname, '../fixtures/test-image.jpg'))
      .expect(200);

    expect(res.body.message).toBe('New picture added!');
    expect(res.body.picture).toHaveProperty('id');
    testImageId = res.body.picture.id;
    expect(res.body.picture).toHaveProperty('textId');
  });

  test('DELETE /api/pictures/:id deletes picture', async () => {
    const res = await request(app)
      .delete(`/api/pictures/${testImageId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.message).toContain(`Picture id: ${testImageId} deleted!`);
  });

  test('POST /api/pictures/upload fails to upload monthly picture without year', async () => {
    const res = await request(app)
      .post('/api/pictures/upload')
      .set('Authorization', `Bearer ${token}`)
      .field('type', 'monthly')
      .field('month', '01')
      .field('textFi', 'testi')
      .field('keywords', 'testi1,testi2,testi3,testi4')
      .attach('image', path.resolve(__dirname, '../fixtures/test-image.jpg'))
      .expect(400);

    expect(res.body.messages.en).toBe(
      'Year and month required for monthly pictures',
    );
  });

  test('POST /api/pictures/upload fails to upload picture without valid token', async () => {
    const res = await request(app)
      .post('/api/pictures/upload')
      .set('Authorization', `Bearer ${token}1`)
      .field('type', 'birds')
      .field('textFi', 'testi')
      .field('keywords', 'testi1,testi2,testi3,testi4')
      .attach('image', path.resolve(__dirname, '../fixtures/test-image.jpg'))
      .expect(401);

    expect(res.body.messages.en).toBe('You are not logged in');
  });

  test('POST /api/pictures/upload fails with big file size', async () => {
    const res = await request(app)
      .post('/api/pictures/upload')
      .set('Authorization', `Bearer ${token}`)
      .field('type', 'birds')
      .field('textFi', 'testi')
      .field('keywords', 'testi1,testi2,testi3,testi4')
      .attach(
        'image',
        path.resolve(__dirname, '../fixtures/test-image-large-file.jpg'),
      )
      .expect(400);

    console.log(res.body);
  });
});
