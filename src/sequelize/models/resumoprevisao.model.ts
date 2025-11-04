import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/config";
import Fitas from "./fitas.model";

interface ResumoPrevisaoAttributes {
  idresumo: number;
  coracoes: number;
  previsao: number;
  semanaprev: number;
  semanacorte: number;
  mes: number;
  anoprev: number;
  anocorte: number
  idfita: number
}

type ResumoPrevisaoCreation = Optional<ResumoPrevisaoAttributes, "idresumo">;

export class ResumoPrevisao extends Model<ResumoPrevisaoAttributes, ResumoPrevisaoCreation>
  implements ResumoPrevisaoAttributes {
  semanaprev: number;
  semanacorte: number;
  anoprev: number;
  anocorte: number;
  idresumo!: number;
  coracoes!: number;
  previsao!: number;
  semana!: number;
  mes!: number;
  ano!: number;
  idfita: number;
}

ResumoPrevisao.init(
  {
    idresumo: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    coracoes: DataTypes.DECIMAL(10, 2),
    previsao: DataTypes.DECIMAL(10, 2),
    semanaprev: DataTypes.INTEGER,
    mes: DataTypes.INTEGER,
    anoprev: DataTypes.INTEGER,
    anocorte: DataTypes.INTEGER,
    semanacorte: DataTypes.INTEGER,
    idfita: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "resumoprevisao",
    timestamps: false,
  }
);

ResumoPrevisao.belongsTo(Fitas, { foreignKey: "idfita", as: "fita" });



export default ResumoPrevisao;
