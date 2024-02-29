import { DataTypes } from "sequelize";
import { sequelize } from "../sequelize/sequelize.js";
import { User } from "./user.js";

export const Pack = sequelize.define("pack", {
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
}, {
  timestamps: false
});