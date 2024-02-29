import { DataTypes } from "sequelize";
import { sequelize } from "../sequelize/sequelize.js";

export const File = sequelize.define("file", {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,

    defaultValue: DataTypes.UUIDV4,
  },
  type: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },

  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },

  url: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },

  size: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  originalFilePath: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  encupsFile: {
    type: DataTypes.STRING(256),
    allowNull: true,
  }
}, {
  timestamps: false
});