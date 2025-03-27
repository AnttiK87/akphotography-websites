const { sequelize } = require('../utils/db')
const { Model, DataTypes } = require('sequelize')

class Keyword extends Model {}

Keyword.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    keyword: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    underscored: true,
    modelName: 'keyword',
  },
)

module.exports = Keyword
