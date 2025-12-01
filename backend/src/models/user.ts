import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

import { sequelize } from '../utils/db.js';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare username: string;
  declare email: string;
  declare passwordHash: string;
  declare role: string;
  declare lastLogin: CreationOptional<Date>;
  declare loginTime: CreationOptional<Date>;
  declare profilePicture: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Name cannot be empty',
        },
        len: {
          args: [3, 50],
          msg: 'Name must be between 3 and 50 characters long',
        },
      },
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'username cannot be empty',
        },
        len: {
          args: [3, 50],
          msg: 'Name must be between 3 and 50 characters long',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'Name cannot be empty',
        },
        isEmail: {
          msg: 'Must be a valid email',
        },
      },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    loginTime: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '/images/about/profile-picture.jpg',
      validate: {
        notEmpty: {
          msg: 'Name cannot be empty',
        },
      },
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'user',
  },
);

export default User;
