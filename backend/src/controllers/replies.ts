import express, { Request, Response } from 'express';

import { replyFinder } from '../middleware/finders.js';
import { validateReplyInput } from '../middleware/validateInput.js';
import { replyChangeHandler } from '../middleware/validateUpdateInput.js';
import {
  validateOwner,
  validateOwnerOrAdmin,
} from '../middleware/validateAuthorisation.js';

import { replyIncludeAll } from '../utils/includeOptions.js';
import { queryByIdOptions } from '../utils/queryHelpers.js';

import { sendCommentNotification } from '../services/emailService.js';
import { getReplyById } from '../services/replyService.js';

import { ReplyInput } from '../types/types.js';

import models from '../models/index.js';
const { Reply } = models;

const router = express.Router();

// GET /api/replies
// route for getting all replies or filtered by pictureId
router.get('/', async (req: Request, res: Response) => {
  const where = queryByIdOptions(req.query);

  const replies = await Reply.findAll({
    include: replyIncludeAll,
    order: [['createdAt', 'ASC']],
    where,
  });

  res.json(replies);
});

// POST /api/replies
// route for adding a new reply
router.post(
  '/',
  validateReplyInput,
  async (req: Request<object, object, ReplyInput>, res: Response) => {
    const {
      reply,
      username,
      userId,
      commentId,
      pictureId,
      parentReplyId,
      adminReply,
    } = req.body;

    const newReply = await Reply.create({
      reply,
      username,
      userId,
      commentId,
      pictureId,
      parentReplyId,
      adminReply,
    });

    const replyWithComment = await getReplyById(newReply.id);

    if (!adminReply) {
      await sendCommentNotification(username, pictureId, reply);
    }

    res.json({
      messageEn: 'New reply added!',
      messageFi: 'Uusi vastaus lisätty!',
      reply: replyWithComment,
    });
  },
);

// PUT /api/replies/:id
// route for updating a reply, only user who created the reply can update it.
// Middlewares used:
// - replyFinder: finds the reply by id and attaches it to the request object
// - validateOwner: checks if the user is the owner of the reply
// - changeHandler: handles the update of the reply
router.put(
  '/:id',
  replyFinder,
  validateOwner('reply'),
  replyChangeHandler,
  async (req: Request<object, object, ReplyInput>, res: Response) => {
    await req.reply.save();
    res.json({
      messageEn: 'Reply updated!',
      messageFi: 'Vastaus päivitetty!',
      reply: req.reply,
    });
  },
);

// DELETE /api/replies/:id
// Route for deleting the reply,
// only user who added the reply or admin is allowed to delete it.
// Middlewares used:
// - replyFinder: finds the reply by id and attaches it to the request object
// - validateOwnerOrAdmin: checks if the user is the owner of the reply or an admin
router.delete(
  '/:id',
  replyFinder,
  validateOwnerOrAdmin('reply'),
  async (req: Request, res: Response) => {
    await req.reply.destroy();
    res
      .status(200)
      .json({
        messageEn: 'Reply deleted!',
        messageFi: 'Vastaus Poistettu!',
      })
      .end();
  },
);

export default router;
