import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/config';

// ---- Tipagem ----
interface BancoAttributes {
  idbanco: number;
  banco: string;
  codigo: string;
  cnpj: string;
  urlimage: string;
}

type BancoCreationAttributes = Optional<BancoAttributes, 'idbanco'>;

// ---- Model ----
export class Banco 
  extends Model<BancoAttributes, BancoCreationAttributes> 
  implements BancoAttributes 
{
  idbanco!: number;
  banco!: string;
  codigo!: string;
  cnpj!: string;
  urlimage!: string;
}

Banco.init(
  {
    idbanco: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    banco: {
      type: DataTypes.STRING(70),
      allowNull: false,
    },
    codigo: {
      type: DataTypes.STRING(5),
      allowNull: false,
    },
    cnpj: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    urlimage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'bancos',
    timestamps: false,
  }
);

export default Banco;
