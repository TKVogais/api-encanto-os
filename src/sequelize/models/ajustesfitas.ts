import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/config";

interface AjusteFitaAttributes {
  idajuste: number;
  idfita: number;
  idarea: number;
  data: Date;
  cachos: number;
  kgajustado: number;
}

type AjusteFitaCreationAttributes = Optional<AjusteFitaAttributes, "idajuste">;

export class AjustesFitas extends Model<AjusteFitaAttributes, AjusteFitaCreationAttributes>
  implements AjusteFitaAttributes {
  idajuste!: number;
  idfita!: number;
  idarea!: number;
  data!: Date;
  cachos!: number;
  kgajustado!: number;
}

AjustesFitas.init(
  {
    idajuste: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    idfita: { type: DataTypes.INTEGER, allowNull: false },
    idarea: { type: DataTypes.INTEGER, allowNull: false },
    data: { type: DataTypes.DATE, allowNull: false },
    cachos: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    kgajustado: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  },
  {
    sequelize,
    tableName: "ajustesfitas",
    timestamps: false,
  }
);

export default AjustesFitas;
