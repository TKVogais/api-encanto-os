// src/sequelize/models/fitas.model.ts
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/config";

interface FitaAttributes { 
  idfita: number; 
  fita: string; 
  hex: string; 
}
type FitaCreationAttributes = Optional<FitaAttributes, "idfita">;

export class Fitas extends Model<FitaAttributes, FitaCreationAttributes> implements FitaAttributes {
  idfita!: number;
  fita!: string;
  hex!: string;
}

Fitas.init({
  idfita: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
  fita: { type: DataTypes.STRING(100), allowNull: false },
  hex: { type: DataTypes.STRING(7), allowNull: false } // exemplo: "#FF0000"
}, { sequelize, tableName: "fitas", timestamps: false });

export default Fitas;
