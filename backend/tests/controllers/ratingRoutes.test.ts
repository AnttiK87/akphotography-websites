import request from 'supertest';
import app from '../../src/app.js';
import models from '../../src/models/index.js';

const { Rating } = models;

describe('POST /api/ratings', () => {
  const userId = 'test-user-1';
  let pictureId: number;

  beforeAll(async () => {
    const pic = await models.Picture.create({
      fileName: 'test.jpg',
      url: '/url',
      urlThumbnail: '/thumb',
      width: 100,
      height: 100,
      type: 'nature',
      viewCount: 0,
    });
    pictureId = pic.id;
  });

  afterEach(async () => {
    await Rating.destroy({ where: { userId, pictureId } });
  });

  afterAll(async () => {
    await models.Picture.destroy({ where: { id: pictureId } });
  });

  test('POST /api/ratings creates a new rating when none exists', async () => {
    const res = await request(app)
      .post('/api/ratings')
      .send({ userId, pictureId, rating: 4 });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Rating saved');
    expect(res.body.rating.rating).toBe(4);
  });

  test('POST /api/ratings fails to add a new rating with invalid picture id', async () => {
    const res = await request(app)
      .post('/api/ratings')
      .send({ userId, pictureId: 555, rating: 4 });

    expect(res.status).toBe(404);
    expect(res.body.messages.en).toBe('Picture not found');
    expect(res.body.messages.fi).toBe('Kuvaa ei löydy');
  });

  test('GET /api/ratings with query returns picture specific ratings', async () => {
    await Rating.create({ userId, pictureId, rating: 4 });
    const res = await request(app)
      .get('/api/ratings')
      .query({ search: pictureId })
      .expect(200);

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBe(1);
  });

  test('POST /api/ratings updates existing rating', async () => {
    await Rating.create({ userId, pictureId, rating: 3 });

    const res = await request(app)
      .post('/api/ratings')
      .send({ userId, pictureId, rating: 5 });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Rating updated');
    expect(res.body.rating.rating).toBe(5);
  });

  test('POST /api/ratings deletes existing rating when rating is 0', async () => {
    const rating = await Rating.create({ userId, pictureId, rating: 2 });

    const res = await request(app)
      .post('/api/ratings')
      .send({ userId, pictureId, rating: 0 });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Rating deleted');
    expect(res.body.id).toBe(rating.id);

    const check = await Rating.findByPk(rating.id);
    expect(check).toBeNull();
  });

  test('POST /api/ratings fails when required fields are missing', async () => {
    const res = await request(app)
      .post('/api/ratings')
      .send({ pictureId, rating: 4 }); // Missing userId

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation error');
    expect(res.body.messages[0].field).toBe('userId');
    expect(res.body.messages[0].message).toBe('Required');
  });
});
