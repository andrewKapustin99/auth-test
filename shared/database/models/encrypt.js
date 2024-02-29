import { DataTypes } from 'sequelize';
import { sequelize } from '../sequelize/sequelize.js';
export const Encrypt = sequelize.define(
  'encrypt',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    key: {
      type: DataTypes.BLOB,
      allowNull: false,
      defaultValue: '',
    },
  },
  {
    timestamps: false,
  }
);
