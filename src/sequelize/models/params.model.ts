import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/config";

interface ParamsAnuaisAttributes {
  idparam: number;
  ano: number;
  meta: number;
  percenmeta: number;
  colhido: number;
  previsto: number;
  coracoescorte: number
  cachoscolhidos: number
  mediacacho: number
}

type ParamsAnuaisCreationAttributes = Optional<ParamsAnuaisAttributes, "idparam">;

export class ParamsAnuais extends Model<ParamsAnuaisAttributes, ParamsAnuaisCreationAttributes>
  implements ParamsAnuaisAttributes {
  idparam!: number;
  ano!: number;
  meta!: number;
  percenmeta!: number;
  colhido!: number;
  previsto!: number;
  mediacacho!: number;
  coracoescorte: number
  cachoscolhidos: number
}

ParamsAnuais.init(
  {
    idparam: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    ano: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    meta: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    percenmeta: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    colhido: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    previsto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    mediacacho: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    coracoescorte: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    cachoscolhidos: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "paramsanuais",
    timestamps: false,
  }
);

export default ParamsAnuais;
