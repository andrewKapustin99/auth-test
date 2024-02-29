import { DataTypes } from "sequelize";
import { sequelize } from "../sequelize/sequelize.js";

export const Contact = sequelize.define("contact", {
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  contact_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },

  is_muted: {
    type: DataTypes.SMALLINT,
    allowNull: false,

    defaultValue: 0,
  },

  user_alias: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
}, {
  timestamps: false
});