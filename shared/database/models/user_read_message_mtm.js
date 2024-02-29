import { DataTypes } from "sequelize";
import { sequelize } from "../sequelize/sequelize.js";
import { User } from "./user.js";
import { UserMessage } from "./user_message.js";
import { GroupChat } from "./group_chat.js";
import { Contact } from "./contact.js";

export const UserReadMessageMtm = sequelize.define('user_read_message_mtm', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,

      autoIncrement: true
    }, 
    message_id: {
      type: DataTypes.INTEGER,
      references: {
        model: UserMessage,
        key: 'id'
      }
    },
    author_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
    reader_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: User,
        key: 'id'
      }
    }
}, {
  timestamps: false
});