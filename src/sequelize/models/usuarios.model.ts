import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/config';
import Pessoa from './pessoas.model';
import { Permissao } from './permissoes.model'; // associação
import UsuarioPermissao from './permissoes.usuarios.model';
// ---- Tipagem ----
interface UsuarioAttributes {
  idusuario: number;
  idpessoa: number;
  usuario: string;
  senha: string;
  tipousuario: string;
  status: string
}

type UsuarioCreationAttributes = Optional<UsuarioAttributes, 'idusuario'>;

// ---- Model ----
export class Usuario extends Model<UsuarioAttributes, UsuarioCreationAttributes>
  implements UsuarioAttributes {
  public tipousuario: string;
  public idusuario!: number;
  public idpessoa!: number;
  public usuario!: string;
  public senha!: string;
  public tiposuaurio!: string
  public status: string
}

Usuario.init(
  {
    idusuario: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    idpessoa: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    usuario: {
      type: DataTypes.STRING(70),
      allowNull: false,
    },
    tipousuario: {
      type: DataTypes.STRING(70),
      allowNull: false,
    },
    senha: {
      type: DataTypes.STRING(70),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(70),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'usuarios',
    timestamps: false,
  }
);

// ---- Associação com Pessoa ----
Usuario.belongsTo(Pessoa, {
  foreignKey: "idpessoa",
  as: "Pessoa"
});


// ---- Associação Many-to-Many com Permissões ----
Usuario.belongsToMany(Permissao, {
  through: UsuarioPermissao,
  foreignKey: 'idusuario',
  otherKey: 'idpermissao',
});

Permissao.belongsToMany(Usuario, {
  through: UsuarioPermissao,
  foreignKey: 'idpermissao',
  otherKey: 'idusuario',
});

export default Usuario;
