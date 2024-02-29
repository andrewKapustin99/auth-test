import { DataTypes } from "sequelize";
import { sequelize } from "../sequelize/sequelize.js";

export const PersonalMessage = sequelize.define('personal_message', {
    message_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    contact_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      type: DataTypes.SMALLINT,
      allowNull: false,

      defaultValue: 0
    },
}, {
  timestamps: true
});