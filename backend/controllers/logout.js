const router = require('express').Router();
const { tokenExtractor } = require('../utils/middleware');

const { User, Session } = require('../models');

router.delete('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);

  let session = await Session.findOne({
    where: {
      userId: user.id,
    },
  });

  if (session) {
    await session.destroy();
  }
  res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
