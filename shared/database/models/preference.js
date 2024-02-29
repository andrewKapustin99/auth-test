import { DataTypes } from "sequelize";
import { sequelize } from "../sequelize/sequelize.js";

export const Preference = sequelize.define("preference", {
    user_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
  
    theme: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },
}, {
  timestamps: false
});