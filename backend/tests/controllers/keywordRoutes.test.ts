import request from 'supertest';
import app from '../../src/app.js';
import models from '../../src/models/index.js';
import { attachKeywordsToPicture } from '../../src/services/keywordService.js';
const { Keyword, Picture } = models;

describe('Keyword routes', () => {
  let token: string;
  let picture: InstanceType<typeof Picture>;

  beforeAll(async () => {
    await Keyword.destroy({ where: {} });

    const res = await request(app)
      .post('/api/login')
      .send({ username: 'admin', password: 'testadmin' });

    token = res.body.token;

    picture = await Picture.create({
      fileName: 'test-picture.jpg',
      url: '/uploads/pictures/test-picture.jpg',
      urlThumbnail: '/uploads/thumbnail/test-picture.webp',
      height: 3000,
      width: 2000,
      type: 'nature',
      monthYear: null,
      viewCount: 4,
    });

    await attachKeywordsToPicture(picture, [
      'test',
      'updateThisKeyword',
      'deleteThisKeyword',
    ]);
  });

  afterAll(async () => {
    await Keyword.destroy({
      where: {
        keyword: [
          'test',
          'keywordWasUpdated',
          'updateThisKeyword',
          'deleteThisKeyword',
        ],
      },
    });
    await Picture.destroy({ where: { id: picture.id } });
  });

  test('GET /api/keywords query returns keywords', async () => {
    await attachKeywordsToPicture(picture, [
      'test',
      'updateThisKeyword',
      'deleteThisKeyword',
    ]);

    const res = await request(app).get('/api/keywords');

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);

    const keywords = res.body.map((kw: { keyword: string }) => kw.keyword);
    expect(keywords).toEqual(
      expect.arrayContaining([
        'test',
        'updateThisKeyword',
        'deleteThisKeyword',
      ]),
    );

    res.body.forEach((kw: { keyword: string; pictures: { id: number }[] }) => {
      expect(kw.pictures[0]).toEqual(
        expect.objectContaining({ id: picture.id }),
      );
    });
  });

  test('created picture has attaches keywords', async () => {
    const keywords = await picture.getKeywords();

    expect(keywords.map((k) => k.keyword)).toEqual(
      expect.arrayContaining([
        'test',
        'updateThisKeyword',
        'deleteThisKeyword',
      ]),
    );
  });

  test('PUT /api/keywords/update/:id logged in admin can update keyword', async () => {
    const keywords = await picture.getKeywords();

    const res = await request(app)
      .put(`/api/keywords/update/${keywords[2].id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        keyword: 'keywordWasUpdated',
      })
      .expect(200);

    expect(res.body.messageEn).toBe('Keyword edited!');
  });

  test('DELETE /api/keywords/:id logged in admin can delete keyword', async () => {
    const keywords = await picture.getKeywords();

    const res = await request(app)
      .delete(`/api/keywords/${keywords[0].id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.messageEn).toBe('Keyword deleted!');

    const deleted = await picture.getKeywords();

    expect(deleted.map((k) => k.keyword)).toEqual(
      expect.arrayContaining(['test', 'keywordWasUpdated']),
    );
  });

  test('PUT /api/keywords/update/:id update keyword fails with invalid token', async () => {
    const keywords = await picture.getKeywords();

    const res = await request(app)
      .put(`/api/keywords/update/${keywords[1].id}`)
      .set('Authorization', 'Bearer invalidtoken')
      .send({
        keyword: 'keywordWasUpdated',
      })
      .expect(401);

    expect(res.body.messages.en).toBe('You are not logged in');
  });
});
