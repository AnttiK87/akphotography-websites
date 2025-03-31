/* logout.js for logging out the user from the application. 
The user's session is found and deleted from the database.*/
const router = require('express').Router()
const { tokenExtractor } = require('../utils/middleware')

const { User, Session } = require('../models')

router.delete('/', tokenExtractor, async (req, res) => {
  console.log(`decodec token: ${JSON.stringify(req.decodedToken)}`)
  const user = await User.findByPk(req.decodedToken.id)

  let session = await Session.findOne({
    where: {
      userId: user.id,
    },
  })

  if (session) {
    await session.destroy()
  }
  res.status(200).json({ message: 'Logged out successfully' })
})

module.exports = router
