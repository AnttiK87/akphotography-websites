import express, { Request, Response } from 'express';
import { sequelize } from '../utils/db.js';

import { tokenExtractor } from '../middleware/tokenExtractor.js';
import { pictureFinder } from '../middleware/finders.js';
import { validatePictureUploadInput } from '../middleware/validateInput.js';
import { handlePictureUpdates } from '../middleware/validateUpdateInput.js';
import { writeFileCreateThumbnail } from '../middleware/createThumbnail.js';
import { handleUpload } from '../middleware/uploadMiddleware.js';

import { picIncludeBasic, PicIncludeAll } from '../utils/includeOptions.js';
import { pictureQueryOptions } from '../utils/queryHelpers.js';
import { deleteFile } from '../utils/fileUtils.js';
import { getPath } from '../utils/pathUtils.js';
import { formatMonthYear } from '../utils/formatMonthYear.js';

import { attachKeywordsToPicture } from '../services/keywordService.js';
import { createPicture } from '../services/pictureService.js';
import { saveText } from '../services/pictureService.js';

import { PictureInput } from '../types/types.js';

import Picture from '../models/picture.js';

const router = express.Router();

// POST /api/pictures/upload
// route for uploading a new picture.
// middlewares used:
// - tokenExtractor: extracts the token from the request header
// - upload.single('image'): handles the file upload
// - validatePictureUploadInput: validates body input
router.post(
  '/upload',
  handleUpload,
  tokenExtractor,
  writeFileCreateThumbnail,
  validatePictureUploadInput,
  async (req: Request<object, object, PictureInput>, res: Response) => {
    const { type, textFi, textEn, year, month, keywords } = req.body;

    let order: number | null = null;
    if (type != 'monthly') {
      const maxOrder: number = await Picture.max('order', {
        where: { type: type },
      });

      order = maxOrder + 1;
    }

    const picture = await createPicture({
      filePath: req.file.path,
      filename: req.file.filename,
      width: req.metadata.width,
      height: req.metadata.height,
      type,
      thumbnailFilename: req.file.thumbnailFilename,
      order: order,
    });

    if (textFi || textEn) {
      const text = await saveText(picture.id, textFi ?? null, textEn ?? null);
      picture.textId = text.id;
    }

    if (type === 'monthly' && year && month) {
      picture.monthYear = formatMonthYear(year, month);
    }

    if (keywords) {
      await attachKeywordsToPicture(picture, keywords);
    }

    await picture.save();
    await picture.reload({
      include: PicIncludeAll,
    });
    res.json({ message: 'New picture added!', picture });
  },
);

// PUT /api/pictures/:id
// route for updating a picture data
// middlewares used:
// - tokenExtractor: extracts the token from the request header
// - pictureFinder: finds the picture by id and attaches it to the request object
// - handlePictureUpdates: handles the updates to the picture
router.put(
  '/:id',
  tokenExtractor,
  pictureFinder,
  handlePictureUpdates,
  async (req: Request, res: Response) => {
    // save, reload and return
    await req.picture.save();
    await req.picture.reload({
      include: PicIncludeAll,
    });

    res.json({ message: 'Picture updated!', picture: req.picture });
  },
);

// GET /api/pictures/allData
// route for getting all pictures with all data
router.get('/allData', async (req: Request, res: Response) => {
  const { where, order } = pictureQueryOptions(req.query);
  // fetching all pictures from db
  // extended with data from tables Text, Keyword, Comment, Reply and Rating
  const pictures = await Picture.findAll({
    attributes: { exclude: ['textId'] },
    include: PicIncludeAll,
    where,
    order,
  });
  res.json(pictures);
});

// GET /api/pictures
// route for getting all pictures with basic data
router.get('/', async (req: Request, res: Response) => {
  const { where, order } = pictureQueryOptions(req.query);

  // fetching pictures from db with basic data
  const pictures = await Picture.findAll({
    attributes: { exclude: ['textId'] },
    include: picIncludeBasic,
    where,
    order,
  });

  res.json(pictures);
});

// GET /api/pictures/latest
// route for getting latest 3 pictures with basic data
router.get('/latest', async (req: Request, res: Response) => {
  const { where, order } = pictureQueryOptions(req.query);
  // fetching 3 lastest pictures from db
  const pictures = await Picture.findAll({
    attributes: { exclude: ['textId'] },
    include: picIncludeBasic,
    where,
    order,
    limit: 3,
  });

  res.json(pictures);
});

// PUT /api/pictures//addView/:id
// route for adding view count to the picture
// middlewares used:
// - pictureFinder: finds the picture by id and attaches it to the request object
router.put(
  '/addView/:id',
  pictureFinder,
  async (req: Request, res: Response) => {
    const picture: Picture = req.picture;
    picture.viewCount = picture.viewCount + 1;

    await picture.save();
    await picture.reload({
      include: picIncludeBasic,
    });

    res.json(picture);
  },
);

// PUT /api/pictures/ordeUp/:id
// route for changind order upwards
// middlewares used:
// - tokenExtractor: extracts the token from the request header
// - pictureFinder: finds the picture by id and attaches it to the request object
router.put(
  '/orderUp/:id',
  tokenExtractor,
  pictureFinder,
  async (req: Request, res: Response) => {
    const picture: Picture = req.picture;

    if (picture.type === 'monthly') {
      res.status(400).json({
        error: 'Change month and year if you want to reorder monthly pictures!',
      });
      return;
    }

    const transaction = await sequelize.transaction();
    let newOrder: number;

    if (picture.order === null || picture.order === 0) {
      const maxOrder: number = await Picture.max('order', {
        where: { type: picture.type },
        transaction,
      });

      newOrder = (maxOrder ?? 0) + 1;

      picture.order = newOrder;

      await picture.save();

      const updatedPicture = await Picture.findByPk(picture.id, {
        include: picIncludeBasic,
      });

      res.json({
        picture1: updatedPicture,
        picture2: null,
        message: 'Order updated!',
      });
      return;
    } else {
      newOrder = picture.order + 1;
    }

    const pictureBefore = await Picture.findOne({
      where: {
        type: picture.type,
        order: newOrder,
      },
      transaction,
    });

    if (!pictureBefore) {
      await transaction.rollback();
      res.status(400).json({ error: 'This is already first picture' });
      return;
    }

    picture.order = newOrder;
    await picture.save({ transaction });

    pictureBefore.order =
      pictureBefore.order != null ? pictureBefore.order - 1 : null;
    await pictureBefore.save({ transaction });

    await transaction.commit();

    const updatedPicture = await Picture.findByPk(picture.id, {
      include: picIncludeBasic,
    });
    const updatedPictureBefore = await Picture.findByPk(pictureBefore.id, {
      include: picIncludeBasic,
    });

    res.json({
      picture1: updatedPicture,
      picture2: updatedPictureBefore,
      message: 'Order updated!',
    });
  },
);

// PUT /api/pictures/ordeDown/:id
// route for changind order downwards
// middlewares used:
// - tokenExtractor: extracts the token from the request header
// - pictureFinder: finds the picture by id and attaches it to the request object
router.put(
  '/orderDown/:id',
  tokenExtractor,
  pictureFinder,
  async (req: Request, res: Response) => {
    const picture: Picture = req.picture;

    if (picture.type === 'monthly') {
      res.status(400).json({
        error: 'Change month and year if you want to reorder monthly pictures!',
      });
      return;
    }

    const transaction = await sequelize.transaction();

    let newOrder: number;
    if (picture.order === null) {
      const maxOrder: number = await Picture.max('order', {
        where: { type: picture.type },
        transaction,
      });

      newOrder = (maxOrder ?? 0) + 1;
      picture.order = newOrder;
      await picture.save({ transaction });

      const updatedPicture = await Picture.findByPk(picture.id, {
        include: picIncludeBasic,
      });

      res.json({
        picture1: updatedPicture,
        picture2: null,
        message: 'Order updated!',
      });
    } else {
      newOrder = picture.order - 1;
    }

    const pictureAfter = await Picture.findOne({
      where: {
        type: picture.type,
        order: newOrder,
      },
      transaction,
    });

    if (!pictureAfter) {
      await transaction.rollback();
      res.status(400).json({ error: 'This is already last picture' });
      return;
    }

    picture.order = newOrder;
    await picture.save({ transaction });

    pictureAfter.order =
      pictureAfter.order != null ? pictureAfter.order + 1 : null;
    await pictureAfter.save({ transaction });

    await transaction.commit();

    const updatedPicture = await Picture.findByPk(picture.id, {
      include: picIncludeBasic,
    });
    const updatedPictureAfter = await Picture.findByPk(pictureAfter.id, {
      include: picIncludeBasic,
    });

    res.json({
      picture1: updatedPicture,
      picture2: updatedPictureAfter,
      message: 'Order updated!',
    });
  },
);

// DELETE /api/pictures/:id
// route for deleting the picture and files from the server
// middlewares used:
// - tokenExtractor: extracts the token from the request header
// - pictureFinder: finds the picture by id and attaches it to the request object
router.delete(
  '/:id',
  tokenExtractor,
  pictureFinder,
  async (req: Request, res: Response) => {
    const picture: Picture = req.picture;
    const isDevEnv = process.env.NODE_ENV === 'development';
    const pathExtension = isDevEnv ? 'backend/public_html/' : 'public_html/';

    const filePath = getPath(pathExtension, picture.url);
    const thumbnailPath = getPath(pathExtension, picture.urlThumbnail || '');

    deleteFile(filePath);
    if (picture.urlThumbnail != null) {
      deleteFile(thumbnailPath);
    }

    await picture.destroy();
    res
      .status(200)
      .json({
        message: `Picture id: ${picture.id} deleted!`,
      })
      .end();
  },
);

export default router;
