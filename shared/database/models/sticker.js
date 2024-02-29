import { DataTypes } from 'sequelize';
import { sequelize } from '../sequelize/sequelize.js';
import { UserMessage } from './user_message.js';
import { User } from './user.js';
import { File } from './file.js';

export const Sticker = sequelize.define(
  'sticker',
  {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    pack_id: {
        type: DataTypes.INTEGER,
    },
    file_id: {
        type: DataTypes.UUID,
    },
  },
  {
    timestamps: false,
  }
);
