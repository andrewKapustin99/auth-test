import { DataTypes } from 'sequelize';
import { sequelize } from '../sequelize/sequelize.js';

export const RegisterSharedSecret = sequelize.define('register_shared_secret', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,

    autoIncrement: true,
  },
  socket_id: {
    type: DataTypes.STRING,
  },
  shared_secret: {
    type: DataTypes.BLOB,
  },
});
