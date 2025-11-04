import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/config';

// ---- Tipagem dos atributos ----
interface PessoaAttributes {
  idpessoa: number;
  name: string;
  sobrenome: string;
  tipopessoa: string;
  cpfcnpj: string;
  logradouro: string;
  cep: string;
  cidade: string;
  estado: string;
  numero: string;
  email: string;
  telefone: string;
  urlimage: string;
  datanasc: Date;
  estadocivil: string;
  bairro: string;
}

// Campos opcionais na criação (id auto-incremento)
type PessoaCreationAttributes = Optional<PessoaAttributes, 'idpessoa'>;

// ---- Model ----
export class Pessoa extends Model<PessoaAttributes, PessoaCreationAttributes>
  implements PessoaAttributes {
  public idpessoa!: number;
  public name!: string;
  public sobrenome!: string;
  public tipopessoa!: string;
  public cpfcnpj!: string;
  public logradouro!: string;
  public cep!: string;
  public cidade!: string;
  public estado!: string;
  public numero!: string;
  public email!: string;
  public telefone!: string;
  public urlimage!: string;
  public datanasc!: Date;
  public estadocivil!: string;
  public bairro!: string;
}

// ---- Inicialização do model ----
Pessoa.init(
  {
    idpessoa: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(70),
      allowNull: false,
    },
    sobrenome: {
      type: DataTypes.STRING(70),
      allowNull: false,
    },
    tipopessoa: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    cpfcnpj: {
      type: DataTypes.STRING(25),
      allowNull: false,
      unique: true,
    },
    logradouro: {
      type: DataTypes.STRING(100),
      defaultValue: '',
    },
    cep: {
      type: DataTypes.STRING(15),
      defaultValue: '',
    },
    cidade: {
      type: DataTypes.STRING(70),
      defaultValue: '',
    },
    estado: {
      type: DataTypes.STRING(2), // sigla do estado
      defaultValue: '',
    },
    numero: {
      type: DataTypes.STRING(10),
      defaultValue: '',
    },
    email: {
      type: DataTypes.STRING(100),
      defaultValue: '',
    },
    telefone: {
      type: DataTypes.STRING(20),
      defaultValue: '',
    },
    urlimage: {
      type: DataTypes.TEXT,
      defaultValue: '',
    },
    datanasc: {
      type: DataTypes.DATEONLY, // apenas data
      allowNull: true,
    },
    estadocivil: {
      type: DataTypes.STRING(20),
      defaultValue: 'Solteiro(a)',
    },
    bairro: {
      type: DataTypes.STRING(70),
      defaultValue: '',
    },
  },
  {
    sequelize,
    tableName: 'pessoas',
    timestamps: false, // ajuste se não tiver createdAt/updatedAt
  }
);

export default Pessoa;
