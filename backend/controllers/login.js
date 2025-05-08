const jwt = require('jsonwebtoken');
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { SECRET } = require('../utils/config');
const User = require('../models/user');
const Session = require('../models/session');

router.post('/', async (request, response) => {
  const { username, password } = request.body;

  const user = await User.findOne({
    where: {
      username: username,
    },
  });

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    });
  }

  const firstLogin = user.lastLogin === null ? true : false;

  if (user.lastLogin != null) {
    await user.update({ loginTime: new Date() });
    await user.save();
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, SECRET, { expiresIn: '24h' });

  let session = await Session.findOne({
    where: {
      userId: user.id,
    },
  });

  if (session) {
    session.activeToken = token;
    await session.save();
  } else {
    session = new Session({
      activeToken: token,
      userId: user.id,
    });
    await session.save();
  }

  response.status(200).send({
    token,
    username: user.username,
    name: user.name,
    email: user.email,
    lastLogin: user.lastLogin,
    firstLogin,
  });
});

module.exports = router;
