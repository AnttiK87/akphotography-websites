// API routes for comments related requests

// Dependencies
const router = require('express').Router()
const Keyword = require('../models/keyword')
const Picture = require('../models/picture')
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

router.delete('/:id', async (req, res) => {
  console.log(`reqparams: ${req.params.id}`)
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
