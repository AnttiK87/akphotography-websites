import { replyInclude } from '../utils/includeOptions.js';

import models from '../models/index.js';
const { Reply } = models;

export const getReplyById = async (id: string | number) => {
  return Reply.findByPk(id, {
    include: replyInclude,
  });
};
