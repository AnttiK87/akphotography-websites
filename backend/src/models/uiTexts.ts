import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import { sequelize } from '../utils/db.js';

class UiText extends Model<
  InferAttributes<UiText>,
  InferCreationAttributes<UiText>
> {
  declare id: CreationOptional<number>;
  declare key_name: string;
  declare screen: string;
  declare language: string;
  declare content: string;
  declare role: string;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

UiText.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    key_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    screen: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'ui_texts',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['key_name', 'language'],
        name: 'ux_ui_texts_keyname_language',
      },
    ],
  },
);

export default UiText;
