import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

import { sequelize } from '../utils/db.js';

class Keyword extends Model<
  InferAttributes<Keyword>,
  InferCreationAttributes<Keyword>
> {
  declare id: CreationOptional<number>;
  declare keyword: string;
}

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
);

export default Keyword;
