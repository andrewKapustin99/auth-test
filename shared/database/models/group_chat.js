import { DataTypes } from "sequelize";
import { sequelize } from "../sequelize/sequelize.js";
import { User } from "./user.js";

export const GroupChat = sequelize.define("group_chat", {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,

      defaultValue: DataTypes.UUIDV4,
    },

    admin: {
      type: DataTypes.UUID,

      references: {
          model: User,
          key: 'id'
      }
    },

    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },

    is_muted: {
      type: DataTypes.SMALLINT,
      allowNull: false,

      defaultValue: 0,
    },

    description: {
      type: DataTypes.STRING(256),
      allowNull: true,
    },
  
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
    },

}, {
  timestamps: false
});