const { sequelize } = require('../utils/db')
const { Model, DataTypes, fn } = require('sequelize')

class Picture extends Model {}

Picture.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'file name cannot be empty',
        },
      },
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'location cannot be empty',
        },
      },
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    width: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'type cannot be empty',
        },
      },
    },
    month_year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    uploadedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: fn('NOW'),
    },
    textId: {
      // Huom! CamelCase Sequelize-mallissa, mutta snake_case tietokannassa
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'texts',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    timestamps: false,
    underscored: true,
    modelName: 'picture',
  },
)

module.exports = Picture
