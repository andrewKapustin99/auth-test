import { DataTypes } from 'sequelize';
import { sequelize } from '../sequelize/sequelize.js';

export const Version = sequelize.define(
  'version',
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,

      defaultValue: DataTypes.UUIDV4,
    },
    app_version: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cirical_app_version: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    app_size: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING(10000),
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);
