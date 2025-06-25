import { z } from 'zod';

export const commentSchema = z.object({
  username: z.string(),
  comment: z.string(),
  pictureId: z.number(),
  userId: z.string(),
});

export const commentUpdateSchema = z.object({
  username: z.string(),
  comment: z.string(),
  userId: z.string(),
});

export const replySchema = z.object({
  username: z.string(),
  reply: z.string(),
  pictureId: z.number(),
  userId: z.string(),
  commentId: z.number(),
  adminReply: z.boolean(),
  parentReplyId: z.number().nullable().optional(),
});

export const replyUpdateSchema = z.object({
  username: z.string(),
  reply: z.string(),
  userId: z.string(),
  commentId: z.number(),
});
