const path = require('path')
const fs = require('fs')
const sharp = require('sharp')
const { Picture } = require('../models/index')
const { sequelize } = require('./db')

const uploadFolderHighRes = './uploads/pictures/'
const uploadFolderThumbnail = './uploads/thumbnail/'

const generateThumbnail = async (filePath, originalFilename) => {
  const nameWithoutExt = path.basename(
    originalFilename,
    path.extname(originalFilename),
  )
  const thumbnailName = nameWithoutExt + '.webp'
  const outputPath = path.join(uploadFolderThumbnail, thumbnailName)

  await sharp(filePath)
    .resize({ height: 600 })
    .toFormat('webp')
    .toFile(outputPath)

  return `/uploads/thumbnail/${thumbnailName}`
}

const run = async () => {
  try {
    if (!fs.existsSync(uploadFolderHighRes)) {
      console.error(`❌ High-res folder not found: ${uploadFolderHighRes}`)
      process.exit(1)
    }

    if (!fs.existsSync(uploadFolderThumbnail)) {
      console.error(`❌ Thumbnail folder not found: ${uploadFolderThumbnail}`)
      process.exit(1)
    }

    await sequelize.authenticate()
    console.log('Connected to database.')

    const pictures = await Picture.findAll()

    for (const pic of pictures) {
      try {
        if (!pic.urlThumbnail) {
          const fullPath = path.join(uploadFolderHighRes, pic.fileName)

          if (fs.existsSync(fullPath)) {
            const thumbnailUrl = await generateThumbnail(fullPath, pic.fileName)
            pic.urlThumbnail = thumbnailUrl
            await pic.save()
            console.log(`✔ Thumbnail created for ${pic.fileName}`)
          } else {
            console.warn(`⚠ File not found: ${fullPath}`)
          }
        } else {
          console.log(`✔ Thumbnail already exists for ${pic.fileName}`)
        }
      } catch (err) {
        console.error(`❌ Error processing ${pic.fileName}:`, err)
      }
    }

    console.log('All thumbnails generated.')
    await sequelize.close()
    process.exit(0)
  } catch (err) {
    console.error('❌ Error:', err)
    process.exit(1)
  }
}

run()
