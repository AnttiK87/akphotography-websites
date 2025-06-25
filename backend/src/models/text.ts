import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

import { sequelize } from '../utils/db.js';

class Text extends Model<InferAttributes<Text>, InferCreationAttributes<Text>> {
  declare id: CreationOptional<number>;
  declare textFi: CreationOptional<string | null>;
  declare textEn: CreationOptional<string | null>;
  declare pictureId: CreationOptional<number>;
}

Text.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    textFi: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    textEn: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    pictureId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: true,
    underscored: true,
    modelName: 'text',
  },
);

export default Text;
