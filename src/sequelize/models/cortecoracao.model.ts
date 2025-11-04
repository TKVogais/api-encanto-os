import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/config";
import Areas from "./areas.model";
import Fitas from "./fitas.model";
import { CorteCoracao } from "../../entities/cortecoracao";

type CorteCoracaoCreationAttributes = Optional<CorteCoracao, "idcortecoracao">;

export class CorteCoracoes extends Model<CorteCoracao   , CorteCoracaoCreationAttributes> implements CorteCoracao {
  idcortecoracao!: number;
  datacorte!: Date;
  idarea!: number;
  idfita!: number;
  coracoes!: number;
  semana!: number;
  ano!: number;

  // Relações
  area?: Areas;
  fita?: Fitas;
}

CorteCoracoes.init(
  {
    idcortecoracao: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    datacorte: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    idarea: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idfita: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    coracoes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    semana: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ano: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "cortecoracoes",
    timestamps: false,
  }
);

// Relacionamentos
CorteCoracoes.belongsTo(Areas, { foreignKey: "idarea", as: "area" });
CorteCoracoes.belongsTo(Fitas, { foreignKey: "idfita", as: "fita" });

export default CorteCoracoes;
