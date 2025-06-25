import models from '../models/index.js';
const { User } = models;

export const getUserById = async (id: number | string) => {
  return User.findByPk(id);
};

export const getUserByUsername = async (username: string) => {
  return User.findOne({
    where: {
      username,
    },
  });
};
