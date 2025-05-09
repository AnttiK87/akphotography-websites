const router = require('express').Router();
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const { tokenExtractor } = require('../utils/middleware');

const { Picture, Text, Reply, Comment, Rating, Keyword } = require('../models');

const uploadFolderHightRes = './uploads/pictures/';
const uploadFolderThumbnail = './uploads/thumbnail/';

const handlePictureResize = async (file) => {
  const nameWithoutExt = path.basename(file, path.extname(file));
  const filename = nameWithoutExt + '.webp';
  const fullPath = path.join(uploadFolderThumbnail, filename);

  await sharp(file).resize({ height: 600 }).toFormat('webp').toFile(fullPath);

  return { filename };
};

const fs = require('fs');

if (!fs.existsSync(uploadFolderHightRes)) {
  fs.mkdirSync(uploadFolderHightRes, { recursive: true });
}

if (!fs.existsSync(uploadFolderThumbnail)) {
  fs.mkdirSync(uploadFolderThumbnail, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolderHightRes);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only .jpg files are allowed!'));
    }
  },
});

router.get('/text', async (req, res) => {
  const text = await Text.findAll({});
  res.json(text);
});

router.post(
  '/upload',
  tokenExtractor,
  upload.single('image'),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'File was not uploaded' });
    }

    const { width, height } = await sharp(req.file.path).metadata();

    const thumbnail = await handlePictureResize(req.file.path);

    const picture = await Picture.create({
      fileName: req.file.filename,
      url: `/uploads/pictures/${req.file.filename}`,
      urlThumbnail: `/uploads/thumbnail/${thumbnail.filename}`,
      type: req.body.type,
      width: width,
      height: height,
    });

    if (req.body.textFi || req.body.textEn) {
      const text = await Text.create({
        textFi: req.body.textFi || null,
        textEn: req.body.textEn || null,
        pictureId: picture.id,
      });

      picture.textId = text.id;
    }

    if (req.body.year && req.body.month) {
      picture.monthYear = Number(req.body.year) * 100 + Number(req.body.month);
    }

    await picture.save();

    if (req.body.keywords) {
      await attachKeywordsToPicture(picture, req.body.keywords);
    }

    res.json({ message: 'File uploaded successfully!', picture });
  },
);

router.get('/allData/', async (req, res) => {
  const where = {};
  let order = [];

  if (req.query.search) {
    where[Op.or] = [{ type: { [Op.eq]: req.query.search } }];
  }

  if (req.query.search === 'monthly') {
    order = [['monthYear', 'DESC']];
  } else {
    order = [
      ['type', 'ASC'],
      ['uploadedAt', 'DESC'],
    ];
  }

  const pictures = await Picture.findAll({
    attributes: { exclude: ['textId'] },
    include: [
      { model: Text, attributes: ['textFi', 'textEn'] },
      {
        model: Comment,
        attributes: ['id'],
        include: [
          {
            model: Reply,
            attributes: ['id'],
          },
        ],
      },
      {
        model: Rating,
        attributes: ['id', 'rating'],
      },
      {
        model: Keyword,
        attributes: { exclude: 'id' },
        through: { attributes: [] },
      },
    ],
    where,
    order,
  });

  res.json(pictures);
});

router.get('/', async (req, res) => {
  const where = {};
  let order = [];

  if (req.query.search) {
    where[Op.or] = [{ type: { [Op.eq]: req.query.search } }];
  }

  if (req.query.search === 'monthly') {
    order = [['monthYear', 'DESC']];
  } else {
    order = [
      ['type', 'ASC'],
      ['uploadedAt', 'DESC'],
    ];
  }

  const pictures = await Picture.findAll({
    attributes: { exclude: ['textId'] },
    include: [
      { model: Text, attributes: ['textFi', 'textEn'] },
      {
        model: Keyword,
        attributes: { exclude: 'id' },
        through: { attributes: [] },
      },
    ],
    where,
    order,
  });

  res.json(pictures);
});

router.get('/latest', async (req, res) => {
  const where = {};
  let order = [];

  if (req.query.search) {
    where[Op.or] = [{ type: { [Op.eq]: req.query.search } }];
  }

  if (req.query.search === 'monthly') {
    order = [['monthYear', 'DESC']];
  } else {
    order = [['uploadedAt', 'DESC']];
  }

  const pictures = await Picture.findAll({
    attributes: { exclude: ['textId'] },
    include: {
      model: Text,
      attributes: ['textFi', 'textEn'],
    },
    where,
    order,
    limit: 3,
  });

  res.json(pictures);
});

const pictureFinder = async (req, res, next) => {
  req.picture = await Picture.findByPk(req.params.id, {
    include: [
      { model: Text, attributes: ['id', 'textFi', 'textEn'] },
      {
        model: Keyword,
        attributes: { exclude: 'id' },
        through: { attributes: [] },
      },
    ],
  });
  next();
};

router.put('/:id', tokenExtractor, pictureFinder, async (req, res) => {
  if (!req.picture) {
    return res.status(404).json({ error: 'Picture not found' });
  }

  if (!req.picture.text && (req.body?.textFi || req.body?.textEn)) {
    const text = await Text.create({
      textFi: req.body?.textFi || null,
      textEn: req.body?.textEn || null,
      pictureId: req.picture.id,
    });

    req.picture.textId = text.id;
  } else if (req.picture.text) {
    const text = await Text.findByPk(req.picture.text.id);
    if (text) {
      text.textFi = req.body.textFi === null ? null : req.body.textFi;
      text.textEn = req.body.textEn === null ? null : req.body.textEn;
      await text.save();
    }
  }

  if (
    req.picture.text &&
    req.body?.textFi === null &&
    req.body?.textEn === null
  ) {
    const text = await Text.findByPk(req.picture.text.id);
    if (text) {
      await text.destroy();
    }
  }

  await attachKeywordsToPicture(req.picture, req.body.keywords);

  if (req.picture.type !== req.body.type) {
    req.picture.type = req.body.type;
  }

  if (req.body.type === 'monthly' && req.body.year && req.body.month) {
    req.picture.monthYear =
      Number(req.body.year) * 100 + Number(req.body.month);
  } else if (req.picture.monthYear && req.body.type !== 'monthly') {
    req.picture.monthYear = null;
  }

  await req.picture.save();

  await req.picture.reload({
    include: [
      { model: Text, attributes: ['id', 'textFi', 'textEn'] },
      {
        model: Keyword,
        attributes: { exclude: 'id' },
        through: { attributes: [] },
      },
    ],
  });

  res.json(req.picture);
});

router.put('/addView/:id', pictureFinder, async (req, res) => {
  if (!req.picture) {
    return res.status(404).json({ error: 'Picture not found' });
  }

  req.picture.viewCount = req.picture.viewCount + 1;

  await req.picture.save();

  await req.picture.reload({
    include: [
      {
        model: Text,
        required: false,
        attributes: ['id', 'textFi', 'textEn'],
      },
      {
        model: Keyword,
        attributes: { exclude: 'id' },
        through: { attributes: [] },
      },
    ],
  });

  res.json(req.picture);
});

router.delete('/:id', tokenExtractor, pictureFinder, async (req, res) => {
  if (req.picture) {
    try {
      const filePath = path.join(__dirname, '../', req.picture.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      } else {
        console.warn(`File not found: ${filePath}`);
      }

      await req.picture.destroy();
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting file:', error);
      res.status(500).json({ error: 'Error deleting file' });
    }
  } else {
    res.status(404).json({ error: 'Picture not found' });
  }
});

const attachKeywordsToPicture = async (picture, keywords) => {
  if (!keywords) return;

  if (typeof keywords === 'string') {
    keywords = keywords.split(',').map((kw) => kw.trim());
  }

  const existingKeywords = await Keyword.findAll({
    where: { keyword: keywords },
  });

  const existingKeywordSet = new Set(existingKeywords.map((kw) => kw.keyword));

  const newKeywords = keywords.filter((kw) => !existingKeywordSet.has(kw));

  let createdKeywords = [];
  if (newKeywords.length > 0) {
    createdKeywords = await Keyword.bulkCreate(
      newKeywords.map((keyword) => ({ keyword })),
    );
  }

  const allKeywords = [...existingKeywords, ...createdKeywords];

  const currentKeywords = await picture.getKeywords();

  const keywordsToRemove = currentKeywords.filter(
    (kw) => !keywords.includes(kw.keyword),
  );

  if (keywordsToRemove.length > 0) {
    await picture.removeKeywords(keywordsToRemove);
  }

  await picture.setKeywords(allKeywords);
};

module.exports = router;
