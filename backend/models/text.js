const { sequelize } = require('../utils/db')
const { Model, DataTypes } = require('sequelize')

class Text extends Model {}

Text.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    textFi: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Text cannot be empty',
        },
      },
    },
    textEn: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Text cannot be empty',
        },
      },
    },
  },
  {
    sequelize,
    timestamps: true,
    underscored: true,
    modelName: 'text',
  },
)

module.exports = Text
