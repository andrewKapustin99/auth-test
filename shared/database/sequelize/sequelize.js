import * as dotenv from "dotenv"
import Sequelize from "sequelize"

dotenv.config()


export const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  logging: false,
  dialect: 'postgres',
  operatorsAliases: 0,
  pool: {
    max: 5,
    min: 0,
    acquire: 3000,
    idle: 10000
  }})