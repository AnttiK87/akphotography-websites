const router = require('express').Router()
const { Op } = require('sequelize')

const { Rating } = require('../models')

router.get('/', async (req, res) => {
  const where = {}

  if (req.query.search) {
    where[Op.or] = [{ pictureId: { [Op.eq]: req.query.search } }]
  }

  const pictures = await Rating.findAll({
    where,
  })

  res.json(pictures)
})

router.post('/', async (req, res) => {
  const { userId, pictureId } = req.body
  const rating = parseInt(req.body.rating, 10)

  //console.log(`reg.body in backend: ${JSON.stringify(req.body)}`)
  console.log(`rating in backend: ${rating}`)

  if (!userId || !pictureId || isNaN(rating)) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  //console.log(`rating after check: ${rating}`)

  const existingRating = await Rating.findOne({ where: { userId, pictureId } })

  if (existingRating && rating == 0) {
    console.log('deletes rating')
    await existingRating.destroy()
    return res.json({ message: 'Rating deleted', id: existingRating.id })
  } else if (existingRating) {
    const updatedRating = await existingRating.update({ rating })
    return res.json({
      message: 'Rating updated',
      rating: updatedRating,
    })
  } else {
    const newRating = await Rating.create({ userId, pictureId, rating })
    return res.json({
      message: 'Rating saved',
      rating: newRating,
    })
  }
})

module.exports = router
