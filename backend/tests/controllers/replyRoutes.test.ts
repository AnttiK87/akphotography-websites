import request from 'supertest';
import app from '../../src/app.js';
import models from '../../src/models/index.js';
const { Reply, Comment, Picture } = models;

describe('Comment routes', () => {
  let token: string;
  let pictures: InstanceType<typeof Picture>[];
  let comments: InstanceType<typeof Comment>[];

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

    comments = await Comment.bulkCreate([
      {
        comment: 'Test comment1',
        username: 'testuser123',
        userId: '123',
        pictureId: pictures[0].id,
      },
      {
        comment: 'Test comment2',
        username: 'testuser123',
        userId: '123',
        pictureId: pictures[1].id,
      },
    ]);
  });

  afterAll(async () => {
    await Reply.destroy({ where: { username: 'testuser123' } });
    await Comment.destroy({ where: { username: 'testuser123' } });
    await Picture.destroy({ where: { id: pictures[0].id } });
    await Picture.destroy({ where: { id: pictures[1].id } });
  });

  test('POST /api/replies create new reply', async () => {
    const newReply = {
      reply: 'Test reply',
      username: 'testuser123',
      userId: '123',
      pictureId: pictures[0].id,
      commentId: comments[0].id,
      adminReply: false,
    };

    const res = await request(app)
      .post('/api/replies')
      .send(newReply)
      .expect(200);

    expect(res.body.reply.reply).toBe('Test reply');
    expect(res.body.messageEn).toBe('New reply added!');
  });

  test('PUT /api/replies/:id updates reply', async () => {
    const reply = await Reply.create({
      reply: 'Test reply to update',
      username: 'testuser123',
      userId: '123',
      pictureId: pictures[1].id,
      commentId: comments[1].id,
      adminReply: false,
    });

    const res = await request(app)
      .put(`/api/replies/${reply.id}`)
      .send({
        reply: 'Updated reply',
        username: 'testuser123',
        userId: '123',
        commentId: comments[1].id,
      })
      .expect(200);

    expect(res.body.reply.reply).toBe('Updated reply');
  });

  test('GET /api/replies with query returns picture specific comments', async () => {
    const res = await request(app)
      .get('/api/replies')
      .query({ search: pictures[0].id })
      .expect(200);

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).toHaveProperty('reply', 'Test reply');
  });

  test('DELETE /api/replies/:id logged in admin can delete comment', async () => {
    const reply = await Reply.create({
      reply: 'Test reply to delete',
      username: 'testuser123',
      userId: '123',
      pictureId: pictures[1].id,
      commentId: comments[1].id,
    });

    const res = await request(app)
      .delete(`/api/replies/${reply.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.messageEn).toBe('Reply deleted!');

    const deleted = await Reply.findByPk(reply.id);
    expect(deleted).toBeNull();
  });

  test('PUT /api/replies/:id fails with invalid userId', async () => {
    const reply = await Reply.create({
      reply: 'Test reply update fails',
      username: 'testuser123',
      userId: '123',
      pictureId: pictures[1].id,
      commentId: comments[1].id,
    });

    const res = await request(app)
      .put(`/api/replies/${reply.id}`)
      .send({
        reply: 'Updated comment',
        username: 'testuser123',
        userId: '200', // Invalid userId
      })
      .expect(401);

    expect(res.body.messages.en).toBe('Unauthorized to update this reply');
  });

  test('PUT /api/replies/:id does nothing if no changes made', async () => {
    const reply = await Reply.create({
      reply: 'No change reply',
      username: 'testuser123',
      userId: '123',
      pictureId: pictures[0].id,
      commentId: comments[0].id,
    });

    const res = await request(app)
      .put(`/api/replies/${reply.id}`)
      .send({
        reply: 'No change reply',
        userId: '123',
        username: 'testuser123',
        commentId: comments[0].id,
      })
      .expect(400);

    expect(res.body.messages.en).toBe('No changes provided');
  });
});
