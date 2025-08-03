import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  HasManyGetAssociationsMixin,
  HasManySetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyRemoveAssociationMixin,
  HasManyCreateAssociationMixin,
} from 'sequelize';
import { sequelize } from '../utils/db.js';
import Keyword from './keyword.js';

class Picture extends Model<
  InferAttributes<Picture>,
  InferCreationAttributes<Picture>
> {
  declare id: CreationOptional<number>;
  declare fileName: string;
  declare url: string;
  declare urlThumbnail: string | null;
  declare height: number;
  declare width: number;
  declare type: string;
  declare monthYear: number | null;
  declare uploadedAt: CreationOptional<Date>;
  declare textId: number | null;
  declare viewCount: CreationOptional<number>;
  declare keywords?: Keyword[];
  declare order: CreationOptional<number>;

  // Assosiations
  declare getKeywords: HasManyGetAssociationsMixin<Keyword>;
  declare setKeywords: HasManySetAssociationsMixin<Keyword, number>;
  declare addKeyword: HasManyAddAssociationMixin<Keyword, number>;
  declare removeKeyword: HasManyRemoveAssociationMixin<Keyword, number>;
  declare createKeyword: HasManyCreateAssociationMixin<Keyword>;
}

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
        notEmpty: { msg: 'file name cannot be empty' },
      },
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'location cannot be empty' },
      },
    },
    urlThumbnail: {
      type: DataTypes.STRING,
      allowNull: true,
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
        notEmpty: { msg: 'type cannot be empty' },
      },
    },
    monthYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    uploadedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    textId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'texts',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    viewCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'picture',
    tableName: 'pictures',
    timestamps: false,
    underscored: true,
  },
);

export default Picture;
