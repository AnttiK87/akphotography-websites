import models from '../models/index.js';
const { Comment } = models;

export const getCommentById = async (id: string) => {
  return Comment.findByPk(id);
};
