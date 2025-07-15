import Sessions from '../models/session.js';
import logger from '../utils/logger.js';

export const setSession = async (userId: number, token: string) => {
  const session = await Sessions.findOne({ where: { userId } });

  if (session) {
    await session.update({ activeToken: token });
  } else {
    await Sessions.create({ userId, activeToken: token });
  }
};

export const getSessionByToken = async (token: string) => {
  return await Sessions.findOne({ where: { activeToken: token } });
};

export const deleteSessionByUserId = async (userId: number) => {
  const session = await Sessions.findOne({ where: { userId } });
  if (session) {
    await session.destroy();
  } else {
    logger.error('Session not found for userId:', String(userId));
  }
};
