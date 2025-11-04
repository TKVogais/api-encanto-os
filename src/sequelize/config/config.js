"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var sequelize_typescript_1 = require("sequelize-typescript");
var mysql2_1 = require("mysql2"); // necessário para dialectModule
var sequelize = new sequelize_typescript_1.Sequelize(process.env.DB_NAME || '', // nome do banco
process.env.DB_USER || '', // usuário
process.env.DB_PASSWORD || '', // senha
{
    dialect: "mysql",
    logging: true,
    host: process.env.DB_HOST || '',
    dialectModule: mysql2_1.default,
    models: [__dirname + "../models"]
});
exports.default = sequelize;
