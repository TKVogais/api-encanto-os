import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/config";
import { Area } from "../../entities/areas";
import Areas from "./areas.model";

interface ResumoColheitaAttributes {
  idresumo: number;
  mes: number;
  ano: number;
  cachos: number;
  kgcolhidos: number;
  media: number;
  idarea: number
}

type ResumoColheitaCreationAttributes = Optional<ResumoColheitaAttributes, "idresumo">;

export class ResumoColheitaModel extends Model<ResumoColheitaAttributes, ResumoColheitaCreationAttributes>
  implements ResumoColheitaAttributes {
  idresumo!: number;
  mes!: number;
  ano!: number;
  cachos!: number;
  kgcolhidos!: number;
  media!: number;
  idarea: number;
}

ResumoColheitaModel.init(
  {
    idresumo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    mes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ano: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cachos: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    kgcolhidos: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    media: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    idarea: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "resumo_colheitas",
    timestamps: false,
  }
);

ResumoColheitaModel.belongsTo(Areas, { foreignKey: "idarea", as: "area" });

export default ResumoColheitaModel;
