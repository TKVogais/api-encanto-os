import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/config";
import Areas from "./areas.model";

interface ColheitaAttributes {
  idcolheita: number;
  mes: number;
  semana: number;
  ano: number;
  cxs: number;
  cachos: number;
  pesocx: number;
  kgcolhidos: number;
  media: number;
  data: Date
  idarea: number;
}

type ColheitaCreationAttributes = Optional<ColheitaAttributes, "idcolheita">;

export class Colheitas extends Model<ColheitaAttributes, ColheitaCreationAttributes>
  implements ColheitaAttributes {
  idcolheita!: number;
  mes!: number;
  semana!: number;
  ano!: number;
  cxs!: number;
  cachos!: number;
  pesocx!: number;
  kgcolhidos!: number;
  media!: number;
  idarea!: number;
  data: Date
}

Colheitas.init(
  {
    idcolheita: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    data: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    mes: DataTypes.INTEGER,
    semana: DataTypes.INTEGER,
    ano: DataTypes.INTEGER,
    cxs: DataTypes.DECIMAL(10, 2),
    cachos: DataTypes.DECIMAL(10, 2),
    pesocx: DataTypes.DECIMAL(10, 2),
    kgcolhidos: DataTypes.DECIMAL(10, 2),
    media: DataTypes.DECIMAL(10, 2),
    idarea: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "colheitas",
    timestamps: false,
  }
);

// Associação com Areas
Colheitas.belongsTo(Areas, { foreignKey: "idarea", as: "area" });

export default Colheitas;
