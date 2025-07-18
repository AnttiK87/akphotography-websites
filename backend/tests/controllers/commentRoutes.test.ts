import request from 'supertest';
import app from '../../src/app.js';
import models from '../../src/models/index.js';
const { Comment, Picture } = models;

describe('Comment routes', () => {
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
        type: 'nature',
        monthYear: null,
        viewCount: 4,
      },
      {
        fileName: 'testi-picture2.jpg',
        url: '/uploads/pictures/test-picture2.jpg',
        urlThumbnail: '/uploads/thumbnail/test-picture2.webp',
        height: 3000,
        width: 2000,
        type: 'nature',
        monthYear: null,
        viewCount: 4,
      },
    ]);
  });

  afterAll(async () => {
    await Comment.destroy({ where: { username: 'testuser123' } });
    await Picture.destroy({ where: { id: pictures[0].id } });
    await Picture.destroy({ where: { id: pictures[1].id } });
  });

  test('POST /api/comments create new comment', async () => {
    const newComment = {
      comment: 'Test comment',
      username: 'testuser123',
      userId: '123',
      pictureId: pictures[0].id,
    };

    const res = await request(app)
      .post('/api/comments')
      .send(newComment)
      .expect(200);

    expect(res.body.comment.comment).toBe('Test comment');
  });

  test('POST /api/comments creating new comment fails with invalid picture id', async () => {
    const newComment = {
      comment: 'Test comment',
      username: 'testuser123',
      userId: '123',
      pictureId: 555,
    };

    const res = await request(app)
      .post('/api/comments')
      .send(newComment)
      .expect(404);

    expect(res.status).toBe(404);
    expect(res.body.messages.en).toBe('Picture related to comment not found');
    expect(res.body.messages.fi).toBe('Kommenttiin liittyvää kuvaa ei löydy');
  });

  test('PUT /api/comments/:id updates comment', async () => {
    const comment = await Comment.create({
      comment: 'Test comment to update',
      username: 'testuser123',
      userId: '123',
      pictureId: pictures[1].id,
    });

    const res = await request(app)
      .put(`/api/comments/${comment.id}`)
      .send({
        comment: 'Updated comment',
        username: 'testuser123',
        userId: '123',
      })
      .expect(200);

    expect(res.body.comment.comment).toBe('Updated comment');
    expect(res.body.comment.username).toBe('testuser123');
  });

  test('PUT /api/comments/:id updates username', async () => {
    const comment = await Comment.create({
      comment: 'Test comment to update',
      username: 'testuser123',
      userId: '123',
      pictureId: pictures[1].id,
    });

    const res = await request(app)
      .put(`/api/comments/${comment.id}`)
      .send({
        comment: 'Test comment to update',
        username: 'testuser124',
        userId: '123',
      })
      .expect(200);

    expect(res.body.comment.comment).toBe('Test comment to update');
    expect(res.body.comment.username).toBe('testuser124');
  });

  test('PUT /api/comments/:id updatefails if changes were not provided', async () => {
    const comment = await Comment.create({
      comment: 'Test comment to update',
      username: 'testuser123',
      userId: '123',
      pictureId: pictures[1].id,
    });

    const res = await request(app)
      .put(`/api/comments/${comment.id}`)
      .send({
        comment: 'Test comment to update',
        username: 'testuser123',
        userId: '123',
      })
      .expect(400);

    expect(res.body.messages.fi).toBe('Et muuttanut tietoja');
    expect(res.body.messages.en).toBe('No changes provided');
  });

  test('PUT /api/comments/:id fails to update comment that does not exist', async () => {
    const res = await request(app)
      .put('/api/comments/500')
      .send({
        comment: 'Updated comment',
        username: 'testuser123',
        userId: '123',
      })
      .expect(404);

    expect(res.body.messages.en).toBe('Comment not found');
  });

  test('GET /api/comments with query returns picture specific comments', async () => {
    const res = await request(app)
      .get('/api/comments')
      .query({ search: pictures[0].id })
      .expect(200);

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).toHaveProperty('comment', 'Test comment');
  });

  test('GET /api/comment fails with wrong endpoint', async () => {
    const res = await request(app)
      .get('/api/comment')
      .query({ search: pictures[0].id })
      .expect(404);

    expect(res.body.error).toBe('unknown endpoint');
  });

  test('DELETE /api/comments/:id logged in admin can delete comment', async () => {
    const comment = await Comment.create({
      comment: 'Test comment to delete',
      username: 'testuser123',
      userId: '123',
      pictureId: pictures[1].id,
    });

    const res = await request(app)
      .delete(`/api/comments/${comment.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.messageEn).toBe('Comment deleted!');

    const deleted = await Comment.findByPk(comment.id);
    expect(deleted).toBeNull();
  });

  test('PUT /api/comments/:id fails with invalid userId', async () => {
    const comment = await Comment.create({
      comment: 'Comment update fails',
      username: 'testuser123',
      userId: '123',
      pictureId: pictures[1].id,
    });

    const res = await request(app)
      .put(`/api/comments/${comment.id}`)
      .send({
        comment: 'Updated comment',
        username: 'testuser123',
        userId: '200', // Invalid userId
      })
      .expect(401);

    expect(res.body.messages.en).toBe('Unauthorized to update this comment');
  });
});
