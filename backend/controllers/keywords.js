// API routes for comments related requests

// Dependencies
const router = require('express').Router()
const Keyword = require('../models/keyword')
const Picture = require('../models/picture')
const { tokenExtractor } = require('../utils/middleware')

// Get all comments
router.get('/', async (req, res) => {
  console.log('called keywords')
  const keywords = await Keyword.findAll({
    include: {
      model: Picture,
      attributes: ['id'],
      through: { attributes: [] },
    },
  })
  res.json(keywords)
})

router.put('/update/:id', tokenExtractor, async (req, res) => {
  console.log(
    'ended up here editing keyword with data: ',
    JSON.stringify(req.body),
  )
  const keyword = await Keyword.findByPk(Number(req.params.id))
  if (!keyword) {
    return res.status(404).json({ error: 'Keyword not found' })
  }

  keyword.keyword = req.body.keyword
  await keyword.save()

  await keyword.reload({
    include: {
      model: Picture,
      attributes: ['id'],
      through: { attributes: [] },
    },
  })

  res.json(keyword)
})

router.delete('/:id', tokenExtractor, async (req, res) => {
  const keyword = await Keyword.findByPk(Number(req.params.id))
  if (req.body.userId != 'admin') {
    return res.status(401).json({ error: 'unauthorized' })
  }

  console.log(`keyword: ${JSON.stringify(keyword)}`)

  if (keyword) {
    await keyword.destroy()
  }
  res.status(204).end()
})

module.exports = router
