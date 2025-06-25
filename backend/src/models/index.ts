import Picture from './picture.js';
import Text from './text.js';
import Rating from './rating.js';
import Comment from './comment.js';
import Reply from './reply.js';
import Keyword from './keyword.js';
import PictureKeyword from './PictureKeyword.js';
import User from './user.js';
import Session from './session.js';

Picture.hasOne(Text, { foreignKey: 'pictureId', onDelete: 'CASCADE' });
Text.belongsTo(Picture, { foreignKey: 'pictureId' });

Picture.hasMany(Rating, { foreignKey: 'pictureId', onDelete: 'CASCADE' });
Rating.belongsTo(Picture, { foreignKey: 'pictureId' });

Picture.hasMany(Comment, { foreignKey: 'pictureId', onDelete: 'CASCADE' });
Comment.belongsTo(Picture, { foreignKey: 'pictureId' });

Comment.hasMany(Reply, {
  foreignKey: 'commentId',
  onDelete: 'CASCADE',
});
Reply.belongsTo(Comment, { foreignKey: 'commentId' });

Reply.belongsTo(Reply, {
  as: 'parentReply',
  foreignKey: 'parentReplyId',
  onDelete: 'CASCADE',
});
Reply.hasMany(Reply, {
  as: 'childReplies',
  foreignKey: 'parentReplyId',
  onDelete: 'CASCADE',
});

Picture.belongsToMany(Keyword, { through: PictureKeyword });
Keyword.belongsToMany(Picture, { through: PictureKeyword });

export default {
  Picture,
  Text,
  Rating,
  Comment,
  Reply,
  Keyword,
  PictureKeyword,
  User,
  Session,
};
