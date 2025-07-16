import Sessions from '../models/session.js';
<<<<<<< HEAD
import logger from '../utils/logger.js';
=======
>>>>>>> origin/main

export const setSession = async (userId: number, token: string) => {
  const session = await Sessions.findOne({ where: { userId } });

  if (session) {
    await session.update({ activeToken: token });
  } else {
    await Sessions.create({ userId, activeToken: token });
  }
};

<<<<<<< HEAD
=======
export const deleteSessionByToken = async (token: string) => {
  await Sessions.destroy({ where: { activeToken: token } });
};

>>>>>>> origin/main
export const getSessionByToken = async (token: string) => {
  return await Sessions.findOne({ where: { activeToken: token } });
};

export const deleteSessionByUserId = async (userId: number) => {
  const session = await Sessions.findOne({ where: { userId } });
  if (session) {
    await session.destroy();
<<<<<<< HEAD
  } else {
    logger.error('Session not found for userId:', String(userId));
=======
>>>>>>> origin/main
  }
};
