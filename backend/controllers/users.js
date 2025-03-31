const router = require('express').Router()
const bcrypt = require('bcryptjs')
const { User } = require('../models')
const { tokenExtractor } = require('../utils/middleware')

router.get('/', async (req, res) => {
  const users = await User.findAll({})
  res.json(users)
})

router.put('/update', tokenExtractor, async (req, res) => {
  //console.log('you are here on controllers and data', JSON.stringify(req.body))
  const { username, name, email, oldPassword, newPassword1, newPassword2 } =
    req.body

  const user = await User.findByPk(req.decodedToken.id)
  if (user) {
    const passwordCorrect =
      user === null
        ? false
        : await bcrypt.compare(oldPassword, user.passwordHash)

    if (!passwordCorrect) {
      return response.status(401).json({
        error: 'invalid old password!',
      })
    }
    if (newPassword1 != newPassword2) {
      return response.status(401).json({
        error: `New pasword and password confirmation doesn't match!`,
      })
    }

    if (newPassword1.length < 8) {
      return res.status(400).json({
        error: 'Password is too short!',
      })
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(newPassword1, saltRounds)

    user.name = name
    user.username = username
    user.email = email
    user.passwordHash = passwordHash
    await user.save()
    await user.update({ lastLogin: new Date() })
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router
