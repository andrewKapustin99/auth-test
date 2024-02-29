import { DataTypes } from 'sequelize';
import { sequelize } from '../sequelize/sequelize.js';
import { User } from './user.js';

export const UserMessage = sequelize.define(
  'user_message',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,

      autoIncrement: true,
    },

    user_id: {
      type: DataTypes.UUID,

      references: {
        model: User,
        key: 'id',
      },
    },

    text: {
      type: DataTypes.STRING(10000),
      allowNull: true,
    },
    forwardMessage: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    answerMessage: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    replaces: {
      type: DataTypes.INTEGER,

      defaultValue: 0,
    },

    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,

      defaultValue: false,
    },

    send: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    shared_secret: {
      type: DataTypes.BLOB,
      allowNull: false,
      defaultValue: '',
    },
  },
  {
    timestamps: false,
  }
);
