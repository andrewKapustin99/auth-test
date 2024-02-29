import { DataTypes } from 'sequelize';
import { sequelize } from '../sequelize/sequelize.js';

export const User = sequelize.define(
  'user',
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,

      defaultValue: DataTypes.UUIDV4,
    },

    phone: {
      type: DataTypes.STRING(12),
      allowNull: false,
      unique: true,
    },

    discription: {
      type: DataTypes.STRING,
      allowNull: true,

      defaultValue: '',
    },

    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    last_name: {
      type: DataTypes.STRING,
      allowNull: false,

      defaultValue: '',
    },

    notificationToken: {
      type: DataTypes.STRING,
      allowNull: false,

      defaultValue: '',
    },
    status: {
      type: DataTypes.SMALLINT,
      allowNull: false,

      defaultValue: 0,
    },

    icon: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    messages_count: {
      type: DataTypes.INTEGER,
      allowNull: false,

      defaultValue: 0,
    },

    login: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true,
    },

    hash: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },

    secret_key: {
      type: DataTypes.BLOB,
      allowNull: true,
    },

    vox: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    vox_pwd: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);
