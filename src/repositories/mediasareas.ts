// repositories/mediasareas.ts
import { Model, ModelStatic, Transaction } from "sequelize"
import { IMediaAreaRepository } from "../interfaces/mediasareas"
import { CreateMediaAreaDto } from "../DTOs/mediasareas"
import { MediaArea } from "../entities/mediasareas"
import { Op } from "sequelize"

export class MediasAreasRepository implements IMediaAreaRepository {
  private model: ModelStatic<Model<any, any>>
  static readonly ERROR_MODEL_REQUIRED = "É necessário fornecer uma model."

  constructor(model: ModelStatic<Model<any, any>>) {
    if (!model) throw new Error(MediasAreasRepository.ERROR_MODEL_REQUIRED)
    this.model = model
  }

  async create(media: CreateMediaAreaDto): Promise<MediaArea> {
    const { dataValues } = await this.model.create(media as any)
    return dataValues as MediaArea
  }

  async list(): Promise<MediaArea[]> {
    const records = await this.model.findAll({ include: ["area"] })
    return records.map((record) => record.dataValues as MediaArea)
  }

  async listWithFk(idarea: number): Promise<MediaArea[]> {
    const records = await this.model.findAll({ where: { idarea }, include: ["area"] })
    return records.map((record) => record.dataValues as MediaArea)
  }

  async update(valorMedia: number, idarea: number, status: string, idmediaarea: number, transaction: Transaction): Promise<boolean> {
    const [affectedCount] = await this.model.update(
      {
        media: valorMedia,
        idarea,
        status
      },
      { where: { idmediaarea }, transaction }
    )
    console.log(`Linhas afetadas: ${affectedCount}`)
    return affectedCount > 0
  }

  async findByPk(idmediaarea: number, includeArea = false): Promise<MediaArea | null> {
    const record = await this.model.findOne({
      where: { idmediaarea },
      ...(includeArea ? { include: ["area"] } : {}),
    })

    return record ? (record.dataValues as unknown as MediaArea) : null
  }


  async updateMedias(targetAreaId: number, idmediaarea: number, transaction: Transaction): Promise<number> {
    console.log(targetAreaId, idmediaarea)
    const [affectedCount] = await this.model.update(
      { status: "NS" },
      {
        where: {
          idarea: targetAreaId,
          idmediaarea: { [Op.ne]: idmediaarea }
        },
        transaction
      }
    )
    return affectedCount
  }

}
