import express, { Request, Response } from 'express';

import { CommentInput, QueryParamsId } from '../types/types.js';

import { commentFinder } from '../middleware/finders.js';
import { validateCommentInput } from '../middleware/validateInput.js';
import { commentChangeHandler } from '../middleware/validateUpdateInput.js';
import {
  validateOwner,
  validateOwnerOrAdmin,
} from '../middleware/validateAuthorisation.js';

import { queryByIdOptions } from '../utils/queryHelpers.js';

import { sendCommentNotification } from '../services/emailService.js';

import Comment from '../models/comment.js';

const router = express.Router();

// GET /api/comments
// route for getting all comments or filtered by pictureId
router.get(
  '/',
  async (
    req: Request<object, object, object, QueryParamsId>,
    res: Response,
  ) => {
    const where = queryByIdOptions(req.query);
    const comments = await Comment.findAll({
      where,
    });
    res.json(comments);
  },
);

// POST /api/comments
// route for adding a new comment
// Middlewares used:
// - validateCommentInput: validates body input
router.post(
  '/',
  validateCommentInput,
  async (req: Request<object, object, CommentInput>, res: Response) => {
    const { comment, username, userId, pictureId } = req.body;

    const newComment = await Comment.create({
      comment,
      username,
      userId,
      pictureId,
    });

    // Send email notification to the admin when a new comment is added
    await sendCommentNotification(username, pictureId, comment);

    res.json({
      messageEn: 'New comment added!',
      messageFi: 'Uusi kommentti lisätty!',
      comment: newComment,
    });
  },
);

// PUT /api/comments/:id
// route for updating a comment, only user who created the comment can update it.
// Middlewares used:
// - commentFinder: finds the comment by id and attaches it to the request object
// - validateOwner: checks if the user is the owner of the comment
// - changeHandler: handles the update of the comment
router.put(
  '/:id',
  commentFinder,
  validateOwner('comment'),
  commentChangeHandler,
  async (req: Request<object, object, CommentInput>, res: Response) => {
    const updatedComment: Comment = req.comment;
    await updatedComment.save();

    res.json({
      messageEn: 'Comment updated!',
      messageFi: 'Kommentti päivitetty!',
      comment: updatedComment,
    });
  },
);

// DELETE /api/comments/:id
// Route for deleting the comment,
// only user who added the comment or admin is allowed to delete it.
// Middlewares used:
// - commentFinder: finds the comment by id and attaches it to the request object
// - validateOwnerOrAdmin: checks if the user is the owner of the comment or an admin
router.delete(
  '/:id',
  commentFinder,
  validateOwnerOrAdmin('comment'),
  async (req: Request, res: Response) => {
    const comment: Comment = req.comment;
    // Delete comment if user is authorized.
    await comment.destroy();
    res
      .status(200)
      .json({
        messageEn: 'Comment deleted!',
        messageFi: 'Kommentti poistettu!',
      })
      .end();
  },
);

export default router;
