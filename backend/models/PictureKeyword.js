const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class PictureKeyword extends Model {}

PictureKeyword.init(
  {
    pictureId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'pictures',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    keywordId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'keywords',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    timestamps: false,
    underscored: true,
    modelName: 'pictureKeyword',
  },
)

module.exports = PictureKeyword
