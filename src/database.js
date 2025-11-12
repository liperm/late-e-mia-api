import { Sequelize } from 'sequelize';


const USER = process.env.DATABASE_USER
const PASSWORD = process.env.DATABASE_PASSWORD
const HOST = process.env.DATABASE_HOST

export const sequelize = new Sequelize('postgres', USER, PASSWORD, {
  host: HOST,
  dialect: 'postgres',
  port: 5432,
  logging: true
});
