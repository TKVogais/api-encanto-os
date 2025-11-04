import 'dotenv/config';
import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2';
import banco_de_dados from './databases'; // seu arquivo databases.ts

// Interface fornecida
interface DBConfig {
  db: string;
  user: string;
  pass: string;
  dialect: 'mysql' | 'postgres' | 'sqlite' | 'mssql';
  logging: boolean | ((sql: string) => void);
  host: string;
}

// Seleção do ambiente
let envMode: string = (process.env.DB_MODE as keyof typeof banco_de_dados) || 'desenvolvimento';

// Pega a configuração do banco e faz cast para DBConfig
const config: DBConfig = banco_de_dados[envMode] as DBConfig;

// Conexão com Sequelize
const sequelize = new Sequelize(
  process.env[config.db] || '',
  process.env[config.user] || '',
  process.env[config.pass] || '',
  {
    dialect: config.dialect,
    logging: config.logging,
    host: process.env[config.host] || '',
    dialectModule: mysql2
  }
);

export default sequelize;
