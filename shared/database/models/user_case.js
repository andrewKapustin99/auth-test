import { DataTypes } from "sequelize";
import { sequelize } from "../sequelize/sequelize.js";

export const UserCase = sequelize.define('user_case', {
  user_id: {
    type: DataTypes.UUID, 
    allowNull: false,
  },
  case_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  question: {
    type: DataTypes.STRING,
    allowNull: false
  },
  answer: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: false
});
