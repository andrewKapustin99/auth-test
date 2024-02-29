import { DataTypes } from "sequelize";
import { sequelize } from "../sequelize/sequelize.js";
import { User } from "./user.js";
import { File } from "./file.js";

export const UserLoadFile = sequelize.define('user_load_file', {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,

    defaultValue: DataTypes.UUIDV4,
  },
  file_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: File,
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
});