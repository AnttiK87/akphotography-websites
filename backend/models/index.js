// associations.js
const Picture = require('./picture')
const Text = require('./text')
const Rating = require('./rating')
const Comment = require('./comment')

Picture.hasOne(Text, { foreignKey: 'pictureId', onDelete: 'CASCADE' })
Text.belongsTo(Picture, { foreignKey: 'pictureId' })

Picture.hasMany(Rating, { foreignKey: 'pictureId', onDelete: 'CASCADE' })
Rating.belongsTo(Picture, { foreignKey: 'pictureId' })

Picture.hasMany(Comment, { foreignKey: 'pictureId', onDelete: 'CASCADE' })
Comment.belongsTo(Picture, { foreignKey: 'pictureId' })

module.exports = {
  Picture,
  Text,
  Rating,
  Comment,
}
