// mediasareas.model.ts
import { DataTypes, Model, Optional } from "sequelize"
import sequelize from "../config/config"
import { Areas } from "./areas.model"

interface MediaAreaAttributes {
  idmediaarea: number
  media: number
  idarea: number
  status: string
}

type MediaAreaCreationAttributes = Optional<MediaAreaAttributes, "idmediaarea">

export class MediasAreas extends Model<MediaAreaAttributes, MediaAreaCreationAttributes>
  implements MediaAreaAttributes {
  idmediaarea!: number
  media!: number
  idarea!: number
  status!: string
}

MediasAreas.init(
  {
    idmediaarea: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    media: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    idarea: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "areas", key: "idarea" },
    },
    status: {
      type: DataTypes.STRING(12),
      allowNull: false,
      defaultValue: "NS",
    },
  },
  { sequelize, tableName: "mediasareas", timestamps: false }
)

// Relação
MediasAreas.belongsTo(Areas, { foreignKey: "idarea", as: "area" })

export default MediasAreas
