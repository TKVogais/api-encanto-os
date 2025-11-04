import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/config";
import Lotes from "./lotes.model";

// ---- Tipagem ----
interface AreaAttributes {
  idarea: number;
  idlote: number;
  hect: number;
  hectplant: number;
  plantas: number;
  area: string
}

type AreaCreationAttributes = Optional<AreaAttributes, "idarea">;

// ---- Model ----
export class Areas extends Model<AreaAttributes, AreaCreationAttributes>
  implements AreaAttributes {
  idarea!: number;
  idlote!: number;
  hect!: number;
  hectplant!: number;
  plantas!: number;
  area!: string
}

Areas.init(
  {
    idarea: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    idlote: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    hect: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    hectplant: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    plantas: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    area: DataTypes.STRING(20)
  },
  {
    sequelize,
    tableName: "areas",
    timestamps: false,
  }
);

// ---- Associação com Pessoa ----
Areas.belongsTo(Lotes, { foreignKey: "idlote", as: "lote" });

export default Areas;
