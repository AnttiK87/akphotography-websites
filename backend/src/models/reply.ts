import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

import { sequelize } from '../utils/db.js';

class Reply extends Model<
  InferAttributes<Reply>,
  InferCreationAttributes<Reply>
> {
  declare id: CreationOptional<number>;
  declare reply: string;
  declare username: string;
  declare userId: string;
  declare pictureId: number;
  declare commentId: number;
  declare parentReplyId: CreationOptional<number>;
  declare adminReply: CreationOptional<boolean>;
  declare profilePicture: CreationOptional<string>;
}

Reply.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    reply: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pictureId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    parentReplyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    adminReply: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    profilePicture: {
      type: DataTypes.STRING,
      defaultValue: false,
      allowNull: true,
    },
  },
  {
    sequelize,
    timestamps: true,
    underscored: true,
    modelName: 'reply',
  },
);

export default Reply;
