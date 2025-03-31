/*login.js enables user logging in to the application. 
The user is authenticated by checking the username and password. 
If the user is found and the password is correct, a token is created 
for the user. The token is also saved in the database in the session table. */

const jwt = require('jsonwebtoken')
const router = require('express').Router()
const bcrypt = require('bcryptjs')
const { SECRET } = require('../utils/config')
const User = require('../models/user')
const Session = require('../models/session')

/* for debugging purposes 
router.get("/sessions", async (request, response) => {
  const sessions = await Session.findAll();
  response.json(sessions);
});*/

router.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({
    where: {
      username: username,
    },
  })

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    })
  }

  // Tarkistetaan, onko `last_login` NULL
  const firstLogin = user.lastLogin === null ? true : false
  console.log(`firstLogin: ${firstLogin}`)

  // Päivitetään viimeisin kirjautumisaika
  if (user.lastLogin != null) {
    await user.update({ lastLogin: new Date() })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET, { expiresIn: '24h' })

  let session = await Session.findOne({
    where: {
      userId: user.id,
    },
  })

  // If session already exists, update it with new token
  if (session) {
    session.activeToken = token
    await session.save()
  } else {
    session = new Session({
      activeToken: token,
      userId: user.id,
    })
    await session.save()
  }

  response
    .status(200)
    .send({
      token,
      username: user.username,
      name: user.name,
      email: user.email,
      lastLogin: user.lastLogin,
      firstLogin,
    })
})

module.exports = router
