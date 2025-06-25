import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import { sequelize } from '../utils/db.js';

class Sessions extends Model<
  InferAttributes<Sessions>,
  InferCreationAttributes<Sessions>
> {
  declare id: CreationOptional<number>;
  declare activeToken: string;
  declare userId: number;
}

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
    modelName: 'sessions',
    tableName: 'sessions',
    timestamps: false,
  },
);

export default Sessions;
