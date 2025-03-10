const router = require('express').Router()
const { Op } = require('sequelize')
const multer = require('multer')
const path = require('path')
const sharp = require('sharp')

const { Picture, Text } = require('../models')

// path for storing uploaded pictures
const uploadFolder = './uploads/pictures/'

const fs = require('fs')
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true })
}

// Multer settings for storing files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  },
})

const upload = multer({ storage: storage })

// Endpoint for uploading file and adding a picture
router.post('/upload', upload.single('image'), async (req, res) => {
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
    width: width,
    height: height,
  })

  if (req.body.type === 'monthly') {
    try {
      const text = await Text.create({
        textFi: req.body.textFi,
        textEn: req.body.textEn,
        pictureId: picture.id,
      })

      picture.month_year = Number(req.body.year) * 100 + Number(req.body.month)
      picture.textId = text.id

      console.log(`picture.month_year: ${picture.month_year}`)

      await picture.save()
    } catch (error) {
      console.error('Error saving text:', error)
      return res.status(500).json({ error: 'Error saving text to database' })
    }
  }

  // Lähetä onnistumisviesti asiakkaalle
  res.json({ message: 'File uploaded successfully!', picture })
})

router.get('/', async (req, res) => {
  const where = {}
  let order = []

  if (req.query.search) {
    where[Op.or] = [{ type: { [Op.eq]: req.query.search } }]
  }

  if (req.query.search === 'monthly') {
    order = [['month_year', 'DESC']]
  }

  const pictures = await Picture.findAll({
    attributes: { exclude: ['textId'] },
    include: {
      model: Text,
      attributes: ['textFi', 'textEn'],
    },
    where,
    order,
  })

  res.json(pictures)
})

router.get('/latest', async (req, res) => {
  const pictures = await Picture.findAll({
    attributes: { exclude: ['textId'] },
    include: {
      model: Text,
      attributes: ['textFi', 'textEn'],
    },
    where: {
      type: 'monthly',
    },
    order: [['month_year', 'DESC']],
    limit: 3,
  })

  res.json(pictures)
})

const pictureFinder = async (req, res, next) => {
  req.picture = await Picture.findByPk(req.params.id)
  next()
}

router.delete(
  '/:id',
  pictureFinder,
  /*tokenExtractor,*/ async (req, res) => {
    /*const user = await User.findByPk(req.decodedToken.id)
  if (user.id !== req.blog.userId) {
    return res.status(401).json({ error: 'unauthorized' })
  }*/
    if (req.picture) {
      await req.picture.destroy()
    }
    res.status(204).end()
  },
)

module.exports = router
