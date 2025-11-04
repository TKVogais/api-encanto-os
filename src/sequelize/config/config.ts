import 'dotenv/config';
import { Sequelize } from 'sequelize-typescript';
import mysql2 from 'mysql2'; // necessário para dialectModule

const sequelize = new Sequelize(
  process.env.DB_NAME || '',      // nome do banco
  process.env.DB_USER || '',    // usuário
  process.env.DB_PASSWORD|| '',    // senha
  {
    dialect: "mysql",
    logging: true,
    host: process.env.DB_HOST || '',
    dialectModule: mysql2,
    models: [__dirname + "../models"]
  }
);

export default sequelize;
