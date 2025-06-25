import Sessions from '../models/session.js';

export const setSession = async (userId: number, token: string) => {
  const session = await Sessions.findOne({ where: { userId } });

  if (session) {
    await session.update({ activeToken: token });
  } else {
    await Sessions.create({ userId, activeToken: token });
  }
};

export const deleteSessionByToken = async (token: string) => {
  await Sessions.destroy({ where: { activeToken: token } });
};

export const getSessionByToken = async (token: string) => {
  return await Sessions.findOne({ where: { activeToken: token } });
};

export const deleteSessionByUserId = async (userId: number) => {
  const session = await Sessions.findOne({ where: { userId } });
  if (session) {
    await session.destroy();
  }
};
