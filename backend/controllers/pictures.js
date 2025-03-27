const router = require('express').Router()
const { Op } = require('sequelize')
const multer = require('multer')
const path = require('path')
const sharp = require('sharp')

const { Picture, Text, Reply, Comment, Rating, Keyword } = require('../models')

// path for storing uploaded pictures
const uploadFolder = './uploads/pictures/'

const fs = require('fs')

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  },
})

const upload = multer({ storage: storage })

router.post('/upload', upload.single('image'), async (req, res, next) => {
  console.log(req.body)
  if (!req.file) {
    return res.status(400).json({ error: 'File was not uploaded' })
  }

  const metadata = await sharp(req.file.path).metadata()
  const { width, height } = metadata

  const picture = await Picture.create({
    fileName: req.file.filename,
    url: '/uploads/pictures/' + req.file.filename,
    type: req.body.type,
    width,
    height,
  })

  if (req.body.textFi || req.body.textEn) {
    const text = await Text.create({
      textFi: req.body.textFi || null,
      textEn: req.body.textEn || null,
      pictureId: picture.id,
    })

    if (req.body.year && req.body.month) {
      picture.month_year = Number(req.body.year) * 100 + Number(req.body.month)
    }

    picture.textId = text.id
    await picture.save()
  }

  if (req.body.keywords) {
    let keywords = req.body.keywords

    if (typeof keywords === 'string') {
      keywords = keywords.split(',').map((kw) => kw.trim())
    }

    console.log(`keywords: ${keywords}`)

    const existingKeywords = await Keyword.findAll({
      where: { keyword: keywords },
    })

    const existingKeywordSet = new Set(existingKeywords.map((kw) => kw.keyword))

    const newKeywords = keywords.filter((kw) => !existingKeywordSet.has(kw))

    const createdKeywords = await Promise.all(
      newKeywords.map((keyword) => Keyword.create({ keyword })),
    )

    const allKeywords = [...existingKeywords, ...createdKeywords]

    await picture.addKeywords(allKeywords)
  }

  res.json({ message: 'File uploaded successfully!', picture })
})

router.get('/allData/', async (req, res) => {
  const where = {}
  let order = []

  if (req.query.search) {
    where[Op.or] = [{ type: { [Op.eq]: req.query.search } }]
  }

  if (req.query.search === 'monthly') {
    order = [['month_year', 'DESC']]
  } else {
    order = [
      ['type', 'ASC'],
      ['uploadedAt', 'DESC'],
    ]
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
  })

  res.json(pictures)
})

router.get('/', async (req, res) => {
  const where = {}
  let order = []

  if (req.query.search) {
    where[Op.or] = [{ type: { [Op.eq]: req.query.search } }]
  }

  if (req.query.search === 'monthly') {
    order = [['month_year', 'DESC']]
  } else {
    order = [
      ['type', 'ASC'],
      ['uploadedAt', 'DESC'],
    ]
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
  })

  res.json(pictures)
})

router.get('/latest', async (req, res) => {
  console.log('latest was called')
  const where = {}
  let order = []

  console.log(`search: ${JSON.stringify(req.query.search)}`)
  if (req.query.search) {
    where[Op.or] = [{ type: { [Op.eq]: req.query.search } }]
  }

  if (req.query.search === 'monthly') {
    order = [['month_year', 'DESC']]
  } else {
    order = [['uploadedAt', 'DESC']]
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
  })

  res.json(pictures)
})

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
  })
  next()
}

router.put('/:id', pictureFinder, async (req, res) => {
  console.log(`req.body: ${JSON.stringify(req.body)}`)
  console.log(`req.picture: ${JSON.stringify(req.picture)}`)
  if (req.picture) {
    if (req.picture.text === null && (req.body?.textFi || req.body?.textEn)) {
      try {
        const text = await Text.create({
          textFi: req.body?.textFi || '',
          textEn: req.body?.textEn || '',
          pictureId: req.picture.id,
        })

        req.picture.text.textFi = text.textFi
        req.picture.text.textEn = text.textEn
      } catch (error) {
        console.error('Error saving text:', error)
        return res.status(500).json({ error: 'Error saving text to database' })
      }
    } else if (
      (req.picture.text && req.picture?.text?.textFi != req.body?.textFi) ||
      req.picture?.text?.textEn != req.body?.textEn
    ) {
      try {
        const text = await Text.findByPk(req.picture.text.id)

        if (text) {
          text.textFi = req.body.textFi === null ? null : req.body.textFi
          text.textEn = req.body.textEn === null ? null : req.body.textEn

          await text.save()
        }

        req.picture.text.textFi = text.textFi
        req.picture.text.textEn = text.textEn
      } catch (error) {
        console.error('Error editing text:', error)
        return res.status(500).json({ error: 'Error editing text to database' })
      }
    }

    if (req.body.keywords != null) {
      let keywords = req.body.keywords

      if (typeof keywords === 'string') {
        keywords = keywords.split(',').map((kw) => kw.trim())
      }

      console.log(`keywords: ${keywords}`)

      const existingKeywords = await Keyword.findAll({
        where: { keyword: keywords },
      })

      const existingKeywordSet = new Set(
        existingKeywords.map((kw) => kw.keyword),
      )

      // Löydä uudet avainsanat, joita ei vielä ole kannassa
      const newKeywords = keywords.filter((kw) => !existingKeywordSet.has(kw))

      // Luo puuttuvat avainsanat
      const createdKeywords = await Promise.all(
        newKeywords.map((keyword) => Keyword.create({ keyword })),
      )

      // Yhdistä kaikki avainsanat (vanhat + uudet)
      const allKeywords = [...existingKeywords, ...createdKeywords]

      // 🔹 **POISTO-LOGIIKKA:**
      // Hae nykyiset avainsanat, jotka on liitetty kuvaan
      const currentKeywords = await req.picture?.keywords

      // Etsi avainsanat, jotka pitää poistaa (ovat kannassa mutta eivät uudessa listassa)
      const keywordsToRemove = currentKeywords.filter(
        (kw) => !keywords.includes(kw.keyword),
      )

      if (keywordsToRemove.length > 0) {
        await req.picture.removeKeywords(keywordsToRemove)
      }

      console.log(`all keywords: ${JSON.stringify(allKeywords)}`)

      // Päivitä kuvan avainsanat
      await req.picture.setKeywords(allKeywords)
    }

    if (req.picture.type != req.body.type) {
      req.picture.type = req.body.type
    }

    if (req.body.type === 'monthly') {
      if (req.body.year && req.body.month) {
        req.picture.month_year =
          Number(req.body.year) * 100 + Number(req.body.month)
      }
    } else if (req.picture.month_year != null && req.body.type != 'monthly') {
      req.picture.month_year = null
    }

    await req.picture.save()

    await req.picture.reload({
      include: [
        { model: Text, attributes: ['id', 'textFi', 'textEn'] },
        {
          model: Keyword,
          attributes: { exclude: 'id' },
          through: { attributes: [] },
        },
      ],
    })

    console.log(`returned updated picture: ${JSON.stringify(req.picture)}`)
    res.json(req.picture)
  } else {
    res.status(404).end()
  }
})

router.delete(
  '/:id',
  pictureFinder,
  /*tokenExtractor,*/ async (req, res) => {
    /*const user = await User.findByPk(req.decodedToken.id)
  if (user.id !== req.blog.userId) {
    return res.status(401).json({ error: 'unauthorized' })
  }*/

    if (req.picture) {
      try {
        // Poista tiedosto levyltä
        const filePath = path.join(__dirname, '../', req.picture.url)
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
          console.log(`File deleted: ${filePath}`)
        } else {
          console.warn(`File not found: ${filePath}`)
        }

        // Poista tietue tietokannasta
        await req.picture.destroy()
        res.status(204).end()
      } catch (error) {
        console.error('Error deleting file:', error)
        res.status(500).json({ error: 'Error deleting file' })
      }
    } else {
      res.status(404).json({ error: 'Picture not found' })
    }
  },
)

module.exports = router
