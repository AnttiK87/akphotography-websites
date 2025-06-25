// utils/includeOptions.ts
import models from '../models/index.js';
const { Text, Keyword, Comment, Reply, Rating, Picture } = models;

export const picIncludeBasic = [
  { model: Text, attributes: ['id', 'textFi', 'textEn'] },
  {
    model: Keyword,
    attributes: { exclude: ['id'] },
    through: { attributes: [] },
  },
];

export const PicIncludeAll = [
  {
    model: Text,
    attributes: ['textFi', 'textEn'],
  },
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
    attributes: { exclude: ['id'] },
    through: { attributes: [] },
  },
];

export const replyInclude = [
  { model: Comment, attributes: ['username', 'comment'] },
  {
    model: Reply,
    as: 'parentReply',
    attributes: [
      'id',
      'reply',
      'username',
      'userId',
      'parentReplyId',
      'commentId',
    ],
  },
];

export const replyIncludeAll = [
  {
    model: Comment,
    attributes: ['username', 'comment'],
  },
  {
    model: Reply,
    as: 'childReplies',
    attributes: [
      'id',
      'reply',
      'username',
      'userId',
      'parentReplyId',
      'commentId',
    ],
  },
  {
    model: Reply,
    as: 'parentReply',
    attributes: ['reply', 'username'],
  },
];

export const keywordInclude = {
  model: Picture,
  attributes: ['id'],
  through: { attributes: [] },
};
