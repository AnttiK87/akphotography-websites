import request from 'supertest';
import path from 'path';
import { fileURLToPath } from 'url';

import { generateTestFiles, cleanupTestFiles } from '../generateTestFiles.js';
import app from '../../src/app.js';
import models from '../../src/models/index.js';
const { Picture } = models;

describe('Picture routes', () => {
  let token: string;
  let pictures: InstanceType<typeof Picture>[];

  beforeAll(async () => {
    await generateTestFiles();
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
        urlThumbnail: null,
        height: 3000,
        width: 2000,
        type: 'mammals',
        monthYear: null,
        viewCount: 4,
      },
      {
        fileName: 'testi-picture5.jpg',
        url: '/uploads/pictures/test-picture4.jpg',
        urlThumbnail: null,
        height: 3000,
        width: 2000,
        type: 'monthly',
        monthYear: 202501,
        viewCount: 4,
      },
    ]);
  });

  afterAll(async () => {
    await cleanupTestFiles();
    await Picture.destroy({ where: { id: pictures[0].id } });
    await Picture.destroy({ where: { id: pictures[1].id } });
    await Picture.destroy({ where: { id: pictures[2].id } });
    await Picture.destroy({ where: { id: pictures[3].id } });
  });

  test('GET /api/pictures returns basic picture data', async () => {
    const res = await request(app).get('/api/pictures').expect(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThanOrEqual(4);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).not.toHaveProperty('textId');
  });

  test('GET /api/pictures wihtqery returns monthly pictures', async () => {
    const res = await request(app)
      .get('/api/pictures')
      .query({ search: 'monthly' })
      .expect(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBe(1);
    expect(res.body[0].monthYear).toBe(202501);
  });

  test('GET /api/pictures/allData returns all picture data', async () => {
    const res = await request(app).get('/api/pictures/allData').expect(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThanOrEqual(4);
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

  test('PUT /api/pictures/:id updates type', async () => {
    const updatedPicture = {
      type: 'birds',
    };
    const res = await request(app)
      .put(`/api/pictures/${pictures[1].id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedPicture)
      .expect(200);

    expect(res.body.message).toBe('Picture updated!');
    expect(res.body.picture.type).toBe('birds');
  });

  test('PUT /api/pictures/:id adds only finnish text to picture', async () => {
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

  test('PUT /api/pictures/:id adds only english text to picture', async () => {
    const updatedPicture = {
      type: 'birds',
      textEn: 'test',
    };
    const res = await request(app)
      .put(`/api/pictures/${pictures[1].id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedPicture)
      .expect(200);

    expect(res.body.message).toBe('Picture updated!');
    expect(res.body.picture.text.textEn).toBe('test');
    expect(res.body.picture.text.textFi).toBe(null);
  });

  test('PUT /api/pictures/:id adds both texts and keywords to picture', async () => {
    const updatedPicture = {
      type: 'birds',
      textFi: 'testi',
      textEn: 'test',
      keywords: 'test1,test2,test3,',
    };
    const res = await request(app)
      .put(`/api/pictures/${pictures[3].id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedPicture)
      .expect(200);

    expect(res.body.message).toBe('Picture updated!');
    expect(res.body.picture.text.textFi).toBe('testi');
    expect(res.body.picture.text.textEn).toBe('test');
  });

  test('PUT /api/pictures/:id updates keywords attached to the picture', async () => {
    const updatedPicture = {
      type: 'birds',
      textFi: 'testi',
      textEn: 'test',
      keywords: 'test1,test4,test5,',
    };
    const res = await request(app)
      .put(`/api/pictures/${pictures[3].id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedPicture)
      .expect(200);

    expect(res.body.message).toBe('Picture updated!');
    expect(res.body.picture.text.textFi).toBe('testi');
    expect(res.body.picture.text.textEn).toBe('test');
  });

  test('PUT /api/pictures/:id update fails if changes were not provided', async () => {
    const updatedPicture = {
      type: 'nature',
      keywords: null,
    };
    const res = await request(app)
      .put(`/api/pictures/${pictures[2].id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedPicture)
      .expect(400);

    expect(res.body.messages.fi).toBe('Et muuttanut tietoja');
    expect(res.body.messages.en).toBe('No changes provided');
  });

  test('PUT /api/pictures/:id removes texts from picture', async () => {
    const updatedPicture = {
      type: 'birds',
      textFi: null,
      textEn: null,
      keywords: 'test1,test2,test3,',
    };
    const res = await request(app)
      .put(`/api/pictures/${pictures[3].id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedPicture)
      .expect(200);

    expect(res.body.message).toBe('Picture updated!');
    expect(res.body.picture.text).toBe(null);
  });

  test('PUT /api/pictures/:id updates picture to type monthly with month and year', async () => {
    const res = await request(app)
      .put(`/api/pictures/${pictures[0].id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ type: 'monthly', month: '01', year: '2025' })
      .expect(200);

    expect(res.body.picture.type).toBe('monthly');
  });

  test('PUT /api/pictures/:id updates picture to birds and set monthyear to null', async () => {
    const res = await request(app)
      .put(`/api/pictures/${pictures[0].id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ type: 'birds' })
      .expect(200);

    expect(res.body.picture.type).toBe('birds');
    expect(res.body.picture.monthYear).toBe(null);
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
    const image = path.resolve(__dirname, '../fixtures/test-img.jpg');
    const res = await request(app)
      .post('/api/pictures/upload')
      .set('Authorization', `Bearer ${token}`)
      .field('type', 'monthly')
      .field('month', '01')
      .field('year', '2025')
      .field('textFi', 'testi')
      .field('keywords', 'testi1,testi2,testi3,testi4')
      .attach('image', image)
      .expect(200);

    expect(res.body.message).toBe('New picture added!');
    expect(res.body.picture).toHaveProperty('id');
    testImageId = res.body.picture.id;
    expect(res.body.picture).toHaveProperty('textId');
  });

  test('POST /api/pictures/upload uploads picture with texts', async () => {
    const image = path.resolve(__dirname, '../fixtures/test-img.jpg');
    const res = await request(app)
      .post('/api/pictures/upload')
      .set('Authorization', `Bearer ${token}`)
      .field('type', 'monthly')
      .field('month', '01')
      .field('year', '2025')
      .field('textFi', 'testi')
      .field('textEn', 'test')
      .field('keywords', 'testi1,testi2,testi3,testi4')
      .attach('image', image)
      .expect(200);

    expect(res.body.message).toBe('New picture added!');
    expect(res.body.picture).toHaveProperty('id');
    testImageId = res.body.picture.id;
    expect(res.body.picture).toHaveProperty('textId');
  });

  test('POST /api/pictures/upload uploads picture with texts', async () => {
    const image = path.resolve(__dirname, '../fixtures/test-img.jpg');
    const res = await request(app)
      .post('/api/pictures/upload')
      .set('Authorization', `Bearer ${token}`)
      .field('type', 'monthly')
      .field('month', '01')
      .field('year', '2025')
      .field('textEn', 'test')
      .field('keywords', 'testi1,testi2,testi3,testi4')
      .attach('image', image)
      .expect(200);

    expect(res.body.message).toBe('New picture added!');
    expect(res.body.picture).toHaveProperty('id');
    testImageId = res.body.picture.id;
    expect(res.body.picture).toHaveProperty('textId');
  });

  test('POST /api/pictures/upload uploads picture without texts and keywords', async () => {
    const image = path.resolve(__dirname, '../fixtures/test-img.jpg');
    const res = await request(app)
      .post('/api/pictures/upload')
      .set('Authorization', `Bearer ${token}`)
      .field('type', 'birds')
      .attach('image', image)
      .expect(200);

    expect(res.body.message).toBe('New picture added!');
    expect(res.body.picture).toHaveProperty('id');
    expect(res.body.picture.type).toBe('birds');
    expect(res.body.picture.textId).toBe(undefined);
  });

  test('DELETE /api/pictures/:id deletes picture', async () => {
    const res = await request(app)
      .delete(`/api/pictures/${testImageId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.message).toContain(`Picture id: ${testImageId} deleted!`);
  });

  test('DELETE /api/pictures/:id deletes picture without thubnail', async () => {
    const res = await request(app)
      .delete(`/api/pictures/${pictures[3].id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.message).toContain(
      `Picture id: ${pictures[3].id} deleted!`,
    );
  });

  test('POST /api/pictures/upload fails to upload monthly picture without year', async () => {
    const res = await request(app)
      .post('/api/pictures/upload')
      .set('Authorization', `Bearer ${token}`)
      .field('type', 'monthly')
      .field('month', '01')
      .field('textFi', 'testi')
      .field('keywords', 'testi1,testi2,testi3,testi4')
      .attach('image', path.resolve(__dirname, '../fixtures/test-img.jpg'))
      .expect(400);

    expect(res.body.messages.en).toBe(
      'Year and month required for monthly pictures',
    );
  });

  test('POST /api/pictures/upload fails to upload picture without type', async () => {
    const res = await request(app)
      .post('/api/pictures/upload')
      .set('Authorization', `Bearer ${token}`)
      .field('month', '01')
      .field('textFi', 'testi')
      .field('keywords', 'testi1,testi2,testi3,testi4')
      .attach('image', path.resolve(__dirname, '../fixtures/test-img.jpg'))
      .expect(400);

    expect(res.body.messages[0].field).toBe('type');
    expect(res.body.messages[0].message).toBe('Required');
  });

  test('POST /api/pictures/upload fails to upload picture without valid token', async () => {
    const res = await request(app)
      .post('/api/pictures/upload')
      .set('Authorization', `Bearer ${token}1`)
      .field('type', 'birds')
      .field('textFi', 'testi')
      .field('keywords', 'testi1,testi2,testi3,testi4')
      .attach('image', path.resolve(__dirname, '../fixtures/test-img.jpg'))
      .expect(401);

    expect(res.body.messages.en).toBe('You are not logged in');
  });

  test('POST /api/pictures/upload fails to upload large file', async () => {
    const res = await request(app)
      .post('/api/pictures/upload')
      .set('Authorization', `Bearer ${token}`)
      .field('type', 'monthly')
      .field('month', '02')
      .field('year', '2025')
      .field('textFi', 'testi')
      .field('keywords', 'testi1,testi2,testi3,testi4')
      .attach(
        'image',
        path.resolve(__dirname, '../fixtures/test-large-img.jpg'),
      )
      .expect(400);

    expect(res.body.messages.en).toBe('File too large, max file size 6MB');
  });

  test('POST /api/pictures/upload fails to upload wrong format', async () => {
    const res = await request(app)
      .post('/api/pictures/upload')
      .set('Authorization', `Bearer ${token}`)
      .field('type', 'monthly')
      .field('month', '02')
      .field('year', '2025')
      .field('textFi', 'testi')
      .field('keywords', 'testi1,testi2,testi3,testi4')
      .attach(
        'image',
        path.resolve(__dirname, '../fixtures/test-text-file.txt'),
      )
      .expect(400);

    expect(res.body.messages.en).toBe('Only .jpg files are allowed!');
  });

  test('POST /api/pictures/upload fails to upload multiple files', async () => {
    await request(app)
      .post('/api/pictures/upload')
      .set('Authorization', `Bearer ${token}`)
      .field('type', 'monthly')
      .field('month', '02')
      .field('year', '2025')
      .field('textFi', 'testi')
      .field('keywords', 'testi1,testi2,testi3,testi4')
      .attach(
        'image',
        path.resolve(__dirname, '../fixtures/test-text-file.txt'),
      )
      .attach(
        'image',
        path.resolve(__dirname, '../fixtures/test-text-file.txt'),
      )
      .catch((err) => {
        expect(err.code).toBe('ECONNRESET');
      });
  });

  test('POST /api/pictures/upload fails to upload multiple files', async () => {
    await request(app)
      .post('/api/pictures/upload')
      .set('Authorization', `Bearer ${token}`)
      .field('type', 'monthly')
      .field('month', '02')
      .field('year', '2025')
      .field('textFi', 'testi')
      .field('keywords', 'testi1,testi2,testi3,testi4')
      .attach(
        'image',
        path.resolve(__dirname, '../fixtures/test-text-file.txt'),
      )
      .attach(
        'image',
        path.resolve(__dirname, '../fixtures/test-text-file.txt'),
      )
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.messages.en).toBe(
          'Too many files! Only one file at a time!',
        );
      })
      .catch((err) => {
        expect(err.code).toBe('ECONNRESET');
      });
  });

  test('POST /api/pictures/upload fails without file', async () => {
    const res = await request(app)
      .post('/api/pictures/upload')
      .set('Authorization', `Bearer ${token}`)
      .field('type', 'monthly')
      .field('month', '02')
      .field('year', '2025')
      .field('textFi', 'testi')
      .field('keywords', 'testi1,testi2,testi3,testi4')
      .expect(400);

    expect(res.body.messages.en).toBe('File missing or invalid!');
  });

  test('POST /api/pictures/upload fails to upload picture without valid token', async () => {
    const res = await request(app)
      .post('/api/pictures/upload')
      .set('Authorization', 'vfvsdvsvsdf')
      .field('type', 'birds')
      .field('textFi', 'testi')
      .field('keywords', 'testi1,testi2,testi3,testi4')
      .attach('image', path.resolve(__dirname, '../fixtures/test-img.jpg'))
      .expect(401);

    expect(res.body.messages.en).toBe('Token missing');
  });
});
