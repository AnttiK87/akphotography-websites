const router = require('express').Router()
const { Op } = require('sequelize')

const { Reply, Comment } = require('../models')

router.get('/', async (req, res) => {
  const where = {}

  if (req.query.search) {
    where[Op.or] = [{ pictureId: { [Op.eq]: req.query.search } }]
  }

  const replies = await Reply.findAll({
    include: [
      {
        model: Comment,
        attributes: ['username', 'comment'],
      },
      {
        model: Reply,
        as: 'childReplies',
        attributes: [
          'id',
          'reply',
          'username',
          'userId',
          'parentReplyId',
          'commentId',
        ],
      },
      {
        model: Reply,
        as: 'parentReply',
        attributes: ['reply', 'username'],
      },
    ],
    order: [['createdAt', 'ASC']],
    where,
  })

  res.json(replies)
})

router.post('/', async (req, res) => {
  console.log(`new reply reg.body: ${JSON.stringify(req.body)}`)
  const { reply, username, userId, commentId, pictureId, parentReplyId } =
    req.body

  if (!userId || !commentId || !username || !reply || !pictureId) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const newReply = await Reply.create({
    reply,
    username,
    userId,
    commentId,
    pictureId,
    parentReplyId,
  })

  const replyWithComment = await Reply.findByPk(newReply.id, {
    include: [
      { model: Comment, attributes: ['username', 'comment'] },
      {
        model: Reply,
        as: 'parentReply',
        attributes: [
          'id',
          'reply',
          'username',
          'userId',
          'parentReplyId',
          'commentId',
        ],
      },
      {
        model: Reply,
        as: 'parentReply',
        attributes: ['reply', 'username'],
      },
    ],
  })

  return res.json({
    message: 'Reply saved',
    reply: replyWithComment,
  })
})

const replyFinder = async (req, res, next) => {
  req.reply = await Reply.findByPk(req.params.id, {
    include: [
      { model: Comment, attributes: ['username', 'comment'] },
      {
        model: Reply,
        as: 'parentReply',
        attributes: [
          'id',
          'reply',
          'username',
          'userId',
          'parentReplyId',
          'commentId',
        ],
      },
      {
        model: Reply,
        as: 'parentReply',
        attributes: ['reply', 'username'],
      },
    ],
  })
  next()
}

router.put('/:id', replyFinder, async (req, res) => {
  if (req.body.referenceUserId !== req.reply.userId) {
    return res.status(401).json({ error: 'unauthorized' })
  }

  if (req.reply) {
    req.reply.reply = req.body.reply
    req.reply.username = req.body.username
    await req.reply.save()
    res.json(req.reply)
  } else {
    res.status(404).end()
  }
})

router.delete('/:id', replyFinder, async (req, res) => {
  if (req.body.userId != req.reply.userId) {
    return res.status(401).json({ error: 'unauthorized' })
  }

  if (req.reply) {
    await req.reply.destroy()
  }
  res.status(204).end()
})

module.exports = router
