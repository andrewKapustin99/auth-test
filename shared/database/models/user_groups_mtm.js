import { DataTypes } from "sequelize";
import { sequelize } from "../sequelize/sequelize.js";

export const UserGroupsMtm = sequelize.define("user_groups_mtm", {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,

      defaultValue: DataTypes.UUIDV4,
    },
}, {
  timestamps: false
});