import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/config";
import Areas from "./areas.model";
import Fitas from "./fitas.model";

interface InventarioCachosAttributes {
  idinventario: number;
  idarea: number;
  idfita: number;
  coracoes: number;
  ajustes: number;
  colhidos: number;
  total: number;
}

type InventarioCachosCreationAttributes = Optional<InventarioCachosAttributes, "idinventario">;

export class InventarioCachosModel extends Model<InventarioCachosAttributes, InventarioCachosCreationAttributes>
  implements InventarioCachosAttributes {
  idinventario!: number;
  idarea!: number;
  idfita!: number;
  coracoes!: number;
  ajustes!: number;
  colhidos!: number;
  total!: number;
}

InventarioCachosModel.init(
  {
    idinventario: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    idarea: { type: DataTypes.INTEGER, allowNull: false },
    idfita: { type: DataTypes.INTEGER, allowNull: false },
    coracoes: { type: DataTypes.INTEGER, allowNull: false },
    ajustes: { type: DataTypes.INTEGER, allowNull: false },
    colhidos: { type: DataTypes.INTEGER, allowNull: false },
    total: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    tableName: "inventario_cachos",
    timestamps: false,
  }
);

// Associações
InventarioCachosModel.belongsTo(Areas, { foreignKey: "idarea", as: "area" });
InventarioCachosModel.belongsTo(Fitas, { foreignKey: "idfita", as: "fita" });

export default InventarioCachosModel;
