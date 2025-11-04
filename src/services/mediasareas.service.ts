// services/mediasareas.service.ts
import {
  CreateMediaAreaDto,
  ResCreateMediaAreaDto,
  ResUpdateMediaAreaDto,
} from "../DTOs/mediasareas"
import { MediaArea } from "../entities/mediasareas"
import { IMediaAreaRepository, IMediaAreaService } from "../interfaces/mediasareas"
import sequelize from "../sequelize/config/config"

export class MediasAreasService implements IMediaAreaService {
  static readonly ERROR_REPO = "É necessário fornecer um repository."

  constructor(private repository: IMediaAreaRepository) {
    if (!repository) throw new Error(MediasAreasService.ERROR_REPO)
  }

  async create(media: CreateMediaAreaDto): Promise<ResCreateMediaAreaDto> {
    console.log(media)
    try {
      const response = await this.repository.create(media)
      return { status: 200, message: "Média de área cadastrada com sucesso!", mediaarea: response }
    } catch (error: any) {
      console.log(error)
      return { status: 500, message: "Falha ao cadastrar a média de área!" }
    }
  }

  async list(): Promise<MediaArea[]> {
    return this.repository.list()
  }

  async update(media: Partial<MediaArea>): Promise<ResUpdateMediaAreaDto> {
    const transaction = await sequelize.transaction()
    try {
      const { idmediaarea, status, idarea, media: valorMedia } = media
      

      // Se o status for "S", desativa os outros registros da mesma área
      if (status === "S") {
        const response = await this.repository.updateMedias(idarea, idmediaarea, transaction)
      }

      const response = await this.repository.update(valorMedia, idarea, status, idmediaarea, transaction)

      if (!response) {
        throw Error("Falha ao atualizar as médias II")
      }

      await transaction.commit()

      // Retorna o registro atualizado com include de área
      const updated = await this.repository.listWithFk(idarea)
      return {
        status: 200,
        message: "Média de área atualizada com sucesso!",
        mediasareas: updated
      }

    } catch (error) {
      console.error(error)
      await transaction.rollback()
      return { status: 500, message: "Falha ao atualizar a média de área!", mediasareas: null }
    }
  }
}
