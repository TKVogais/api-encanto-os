import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/config';
import { Usuario } from './usuarios.model'; // para associação cruzada

// ---- Tipagem ----
interface PermissaoAttributes {
  idpermissao: number;
  permissao: string;
  descricao?: string | null;
}

// Campos opcionais na criação
type PermissaoCreationAttributes = Optional<PermissaoAttributes, 'idpermissao'>;

// ---- Model ----
export class Permissao extends Model<PermissaoAttributes, PermissaoCreationAttributes>
  implements PermissaoAttributes {
  public idpermissao!: number;
  public permissao!: string;
  public descricao!: string | null;
}

Permissao.init(
  {
    idpermissao: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    permissao: {
      type: DataTypes.STRING(70),
      allowNull: false,
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'permissoes',
    timestamps: false,
  }
);

export default Permissao;
