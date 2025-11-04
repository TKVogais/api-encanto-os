import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/config";

import Areas from "./areas.model";
import Fitas from "./fitas.model";
import { PrevisaoColheita } from "../../entities/precisaocolheita";
import CorteCoracoes from "./cortecoracao.model";

type PrevisaoColheitaCreationAttributes = Optional<PrevisaoColheita, "idprevisao">;

export class PrevisaoColheitas extends Model<PrevisaoColheita, PrevisaoColheitaCreationAttributes> implements PrevisaoColheita {
  idprevisao!: number;
  idcortecoracao!: number;
  idarea!: number;
  idfita!: number;
  previsao!: number;
  semana!: number;
  ano!: number;

  // Relacionamentos
  cortecoracao?: CorteCoracoes;
  area?: Areas;
  fita?: Fitas;
}

PrevisaoColheitas.init(
  {
    idprevisao: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    idcortecoracao: {
      type: DataTypes.INTEGER,
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
    previsao: {
      type: DataTypes.FLOAT,
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
    tableName: "previsaocolheita",
    timestamps: false,
  }
);

// Relacionamentos
PrevisaoColheitas.belongsTo(CorteCoracoes, { foreignKey: "idcortecoracao", as: "cortecoracao" });
PrevisaoColheitas.belongsTo(Areas, { foreignKey: "idarea", as: "area" });
PrevisaoColheitas.belongsTo(Fitas, { foreignKey: "idfita", as: "fita" });

export default PrevisaoColheitas;
