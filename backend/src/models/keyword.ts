import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyAddAssociationsMixin,
} from 'sequelize';

import Picture from './picture.js';

import { sequelize } from '../utils/db.js';

class Keyword extends Model<
  InferAttributes<Keyword>,
  InferCreationAttributes<Keyword>
> {
  declare getPictures: BelongsToManyGetAssociationsMixin<Picture>;
  declare addPictures: BelongsToManyAddAssociationsMixin<Picture, number>;

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
      unique: true,
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
