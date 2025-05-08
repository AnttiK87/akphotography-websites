const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { User, Session } = require('../models');
const { tokenExtractor } = require('../utils/middleware');

router.get('/', async (req, res) => {
  const users = await User.findAll({});
  res.json(users);
});

router.get('/session', async (req, res) => {
  const session = await Session.findAll({});
  res.json(session);
});

router.put('/updateLastLogin/:id', async (req, res) => {
  const { lastLogin } = req.body;

  const user = await User.findByPk(req.params.id);
  user.lastLogin = lastLogin;
  await user.save();
  res.json(user);
});

router.put('/updateLoginTime/:id', async (req, res) => {
  const { loginTime } = req.body;

  const user = await User.findByPk(req.params.id);
  user.loginTime = loginTime;
  await user.save();
  res.json(user);
});

router.put('/changePassword', tokenExtractor, async (req, res) => {
  const { oldPassword, newPassword1, newPassword2 } = req.body;

  const user = await User.findByPk(req.decodedToken.id);
  if (user) {
    const passwordCorrect =
      user === null
        ? false
        : await bcrypt.compare(oldPassword, user.passwordHash);

    if (!passwordCorrect) {
      return res.status(401).json({
        error: 'invalid old password!',
      });
    }
    if (newPassword1 != newPassword2) {
      return res.status(400).json({
        error: `New pasword and password confirmation doesn't match!`,
      });
    }

    if (newPassword1.length < 8) {
      return res.status(400).json({
        error: 'Password is too short!',
      });
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword1, saltRounds);

    user.passwordHash = passwordHash;
    await user.save();
    res.json(user);
  } else {
    res.status(404).end();
  }
});

router.put('/updateInfo', tokenExtractor, async (req, res) => {
  const { username, name, email } = req.body;

  const user = await User.findByPk(req.decodedToken.id);
  if (user) {
    user.name = name;
    user.username = username;
    user.email = email;
    await user.save();
    res.json(user);
  } else {
    res.status(404).end();
  }
});

router.put('/updateFirstLogin', tokenExtractor, async (req, res) => {
  const { username, name, email, oldPassword, newPassword1, newPassword2 } =
    req.body;

  const user = await User.findByPk(req.decodedToken.id);
  if (user) {
    const passwordCorrect =
      user === null
        ? false
        : await bcrypt.compare(oldPassword, user.passwordHash);

    if (!passwordCorrect) {
      return res.status(401).json({
        error: 'invalid old password!',
      });
    }
    if (newPassword1 != newPassword2) {
      return res.status(401).json({
        error: `New pasword and password confirmation doesn't match!`,
      });
    }

    if (newPassword1.length < 8) {
      return res.status(400).json({
        error: 'Password is too short!',
      });
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword1, saltRounds);

    user.name = name;
    user.username = username;
    user.email = email;
    user.passwordHash = passwordHash;
    await user.save();
    await user.update({ lastLogin: new Date() });
    await user.update({ loginTime: new Date() });
    res.json(user);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
