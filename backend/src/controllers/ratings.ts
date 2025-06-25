import express, { Request, Response } from 'express';

import { validateRatingInput } from '../middleware/validateInput.js';
import { handleRatingChange } from '../middleware/validateUpdateInput.js';

import { queryByIdOptions } from '../utils/queryHelpers.js';

import models from '../models/index.js';
const { Rating } = models;

const router = express.Router();

// Define the interface for the request body
interface RatingBody {
  rating: number;
  userId: string;
  pictureId: number;
}

// GET /api/ratings
// route for getting all ratings or filtered by pictureId
router.get('/', async (req: Request, res: Response) => {
  const where = queryByIdOptions(req.query);

  const ratings = await Rating.findAll({
    where,
  });

  res.json(ratings);
});

// POST /api/ratings
// Handles rating creation, update, or deletion based on input:
// - If user has not rated: creates a new rating
// - If user has already rated:
//     - rating === 0 → deletes rating
//     - else → updates rating
//
// Middlewares used:
// - validateRatingInput: validates body input
// - handleRatingChange: handles existing rating logic
//
// NOTE: Although this is a POST route, it also performs PUT and DELETE operations
router.post(
  '/',
  validateRatingInput,
  handleRatingChange,
  async (req: Request<object, object, RatingBody>, res: Response) => {
    // sets req.body data to variables
    const { userId, pictureId, rating } = req.body;

    //create new rating if user haven't rated picture yet
    const newRating = await Rating.create({ userId, pictureId, rating });
    res.json({ message: 'Rating saved', rating: newRating });
  },
);

export default router;
