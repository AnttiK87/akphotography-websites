const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

class Sessions extends Model {}

Sessions.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    activeToken: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'active_token',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      field: 'user_id',
    },
  },
  {
    sequelize,
    timestamps: false,
    modelName: 'sessions',
  },
);

module.exports = Sessions;
