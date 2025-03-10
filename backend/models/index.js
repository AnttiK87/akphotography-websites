// associations.js
const Picture = require('./picture')
const Text = require('./text')
const Rating = require('./rating')

// Picture hasOne Text
Picture.hasOne(Text, { foreignKey: 'pictureId', onDelete: 'CASCADE' })
// Text belongsTo Picture
Text.belongsTo(Picture, { foreignKey: 'pictureId' })

// Picture hasOne Text
Picture.hasMany(Rating, { foreignKey: 'pictureId', onDelete: 'CASCADE' })
// Text belongsTo Picture
Rating.belongsTo(Picture, { foreignKey: 'pictureId' })

module.exports = {
  Picture,
  Text,
  Rating,
}
