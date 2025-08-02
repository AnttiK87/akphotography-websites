import express, { Request, Response } from 'express';
import { Op } from 'sequelize';

import { KeywordInput } from '../types/types.js';
import Keyword from '../models/keyword.js';

import { keywordFinder } from '../middleware/finders.js';
import { tokenExtractor } from '../middleware/tokenExtractor.js';
import { validateIsAdmin } from '../middleware/validateAuthorisation.js';

import {
  getKeywordWithPictures,
  reloadKeywordWithPictures,
} from '../services/keywordService.js';

const router = express.Router();

// GET /api/keywords
// route for getting all keywords
router.get('/', async (_req: Request, res: Response) => {
  const keywords = await getKeywordWithPictures();
  res.json(keywords);
});

// PUT /api/keywords/update/:id
// route for updating the keyword
// Middlewares used:
// - keywordFinder: finds the keyword by id
// - tokenExtractor: extracts the token from the request header
// - validateIsAdmin: checks if the user is an admin
router.put(
  '/update/:id',
  keywordFinder,
  tokenExtractor,
  validateIsAdmin,
  async (req: Request<object, object, KeywordInput>, res: Response) => {
    const keyword: Keyword = req.keyword;
    const newKeywordValue = req.body.keyword.trim();

    // check if keyword already exist with new value
    const existingKeyword = await Keyword.findOne({
      where: {
        keyword: newKeywordValue,
        id: { [Op.ne]: keyword.id },
      },
    });

    if (existingKeyword) {
      // transfer picture relations from edited key word to existing keyword
      const pictures = await keyword.getPictures();
      await existingKeyword.addPictures(pictures);

      // delete duplicate keyword
      await keyword.destroy();

      // return combined keyword
      const updatedKeyword = await reloadKeywordWithPictures(existingKeyword);

      res.json({
        messageEn: 'Keyword merged with existing!',
        messageFi: 'Avainsana yhdistetty olemassa olevaan!',
        keyword: updatedKeyword,
      });
      return;
    }

    // save updated keyword
    keyword.keyword = req.body.keyword;
    await keyword.save();

    // reload the keyword with pictures
    const updatedKeyword = await reloadKeywordWithPictures(keyword);

    res.json({
      messageEn: 'Keyword edited!',
      messageFi: 'Avainsana muokattu!',
      keyword: updatedKeyword,
    });
  },
);

// DELETE /api/keywords/:id
// route for deleting the keyword
// Middlewares used:
// - keywordFinder: finds the keyword by id
// - tokenExtractor: extracts the token from the request header
// - validateIsAdmin: checks if the user is an admin
router.delete(
  '/:id',
  keywordFinder,
  tokenExtractor,
  validateIsAdmin,
  async (req: Request, res: Response) => {
    await req.keyword.destroy();
    res
      .status(200)
      .json({
        messageEn: 'Keyword deleted!',
        messageFi: 'Avainsana poistettu!',
      })
      .end();
  },
);

export default router;
