import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/config';

interface RoleAttributes {
  idrole: number;
  name: string;
}

type RoleCreationAttributes = Optional<RoleAttributes, 'idrole'>;

export class Role extends Model<RoleAttributes, RoleCreationAttributes>
  implements RoleAttributes {
  public idrole!: number;
  public name!: string;
}

Role.init(
  {
    idrole: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: 'roles',
    timestamps: false,
  }
);
