import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';

import { sequelize } from '../utils/db.js';

class PictureKeyword extends Model<
  InferAttributes<PictureKeyword>,
  InferCreationAttributes<PictureKeyword>
> {
  declare pictureId: number;
  declare keywordId: number;
}

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
);

export default PictureKeyword;
