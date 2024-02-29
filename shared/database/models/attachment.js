import { DataTypes } from 'sequelize';
import { sequelize } from '../sequelize/sequelize.js';
import { UserMessage } from './user_message.js';
import { User } from './user.js';
import { File } from './file.js';

export const Attachment = sequelize.define(
  'attachment',
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,

      defaultValue: DataTypes.UUIDV4,
    },
    message_id: {
      type: DataTypes.INTEGER,

      references: {
        model: UserMessage,
        key: 'id',
      },
    },

    user_id: {
      type: DataTypes.UUID,

      references: {
        model: User,
        key: 'id',
      },
    },

    file_id: {
      type: DataTypes.UUID,

      references: {
        model: File,
        key: 'id',
      },
    },
    originalFilePath: {
      type: DataTypes.STRING(256),
      allowNull: true,
    },
    encupsFile: {
      type: DataTypes.STRING(256),
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);
