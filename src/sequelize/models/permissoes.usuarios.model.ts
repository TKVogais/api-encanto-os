import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/config';

// ---- Tipagem ----
interface UsuarioPermissaoAttributes {
  idusuario_permissao: number;
  idusuario: number;
  idpermissao: number;
}

type UsuarioPermissaoCreationAttributes = Optional<UsuarioPermissaoAttributes, 'idusuario_permissao'>;

export class UsuarioPermissao extends Model<UsuarioPermissaoAttributes, UsuarioPermissaoCreationAttributes>
  implements UsuarioPermissaoAttributes {
  public idusuario_permissao!: number;
  public idusuario!: number;
  public idpermissao!: number;
}

UsuarioPermissao.init(
  {
    idusuario_permissao: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    idusuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'idusuario',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    idpermissao: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'permissoes',
        key: 'idpermissao',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  },
  {
    sequelize,
    tableName: 'usuarios_permissoes',
    timestamps: false,
  }
);

export default UsuarioPermissao;
