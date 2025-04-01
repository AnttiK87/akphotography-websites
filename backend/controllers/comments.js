const router = require('express').Router()
const { Op } = require('sequelize')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../utils/config')

const { Comment, Session } = require('../models')

router.get('/', async (req, res) => {
  const where = {}

  if (req.query.search) {
    where[Op.or] = [{ pictureId: { [Op.eq]: req.query.search } }]
  }

  const comments = await Comment.findAll({
    where,
  })

  res.json(comments)
})

router.post('/', async (req, res) => {
  console.log(`reg.body: ${JSON.stringify(req.body)}`)
  const { comment, username, userId, pictureId } = req.body

  if (!userId || !pictureId || !username || !comment) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const newComment = await Comment.create({
    comment,
    username,
    userId,
    pictureId,
  })

  return res.json({
    message: 'Comment saved',
    comment: newComment,
  })
})

const commentFinder = async (req, res, next) => {
  req.comment = await Comment.findByPk(req.params.id)
  next()
}

// update comment
router.put('/:id', commentFinder, async (req, res) => {
  console.log(`regbody for edie: ${JSON.stringify(req.body)}`)
  console.log(`edits reg.comment: ${JSON.stringify(req.comment)}`)
  if (req.body.referenceUserId !== req.comment.userId) {
    return res.status(401).json({ error: 'unauthorized' })
  }

  if (req.comment) {
    req.comment.comment = req.body.comment
    req.comment.username = req.body.username
    await req.comment.save()
    res.json(req.comment)
  } else {
    res.status(404).end()
  }
})

router.delete('/:id', commentFinder, async (req, res, next) => {
  //console.log(`regbody for delete: ${JSON.stringify(req.body)}`)
  //console.log(`reg.comment: ${JSON.stringify(req.comment)}`)
  //console.log(`reg.authorization: ${req.get('authorization')}`)
  const authorization = req.get('authorization')
  if (authorization) {
    if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
      return next(new Error('TOKEN_MISSING'))
    }

    const token = authorization.substring(7)
    const session = await Session.findOne({ where: { activeToken: token } })

    if (!session) {
      return next(new Error('NOT_LOGGED_IN'))
    }

    req.decodedToken = jwt.verify(token, SECRET)

    if (req.decodedToken.exp <= Math.floor(Date.now() / 1000)) {
      return next(new Error('TOKEN_EXPIRED'))
    }
  } else if (req.body.userId != req.comment.userId) {
    return res.status(401).json({ error: 'unauthorized' })
  }

  if (req.comment) {
    await req.comment.destroy()
  }
  res.status(204).end()
})

module.exports = router
