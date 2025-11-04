// lotes.model.ts
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/config";

interface LoteAttributes { idlote: number; lote: string; descricao: string; }
type LoteCreationAttributes = Optional<LoteAttributes, "idlote">;

export class Lotes extends Model<LoteAttributes, LoteCreationAttributes> implements LoteAttributes {
  idlote!: number;
  lote!: string;
  descricao!: string;
}

Lotes.init({
  idlote: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
  lote: { type: DataTypes.STRING(70), allowNull: false },
  descricao: DataTypes.TEXT
}, { sequelize, tableName: "lotes", timestamps: false });


export default Lotes