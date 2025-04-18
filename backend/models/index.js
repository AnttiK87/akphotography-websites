const Picture = require('./picture');
const Text = require('./text');
const Rating = require('./rating');
const Comment = require('./comment');
const Reply = require('./reply');
const Keyword = require('./keyword');
const PictureKeyword = require('./PictureKeyword');
const User = require('./user');
const Session = require('./session');

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

module.exports = {
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
