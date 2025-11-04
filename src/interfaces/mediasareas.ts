// interfaces/mediasareas.ts
import { Request, Response } from "express"
import { MediaArea } from "../entities/mediasareas"
import {
  CreateMediaAreaDto,
  ResCreateMediaAreaDto,
  ResUpdateMediaAreaDto,
} from "../DTOs/mediasareas"
import { Transaction } from "sequelize"

export interface IMediaAreaController {
  pCreate(req: Request, res: Response): Promise<void>
  gList(req: Request, res: Response): Promise<void>
  uUpdate(req: Request, res: Response): Promise<void>
}

export interface IMediaAreaService {
  create(media: CreateMediaAreaDto): Promise<ResCreateMediaAreaDto>
  list(): Promise<MediaArea[]>
  update(media: MediaArea): Promise<ResUpdateMediaAreaDto>
}

export interface IMediaAreaRepository {
  create(media: CreateMediaAreaDto): Promise<MediaArea>
  list(): Promise<MediaArea[]>
  listWithFk(idarea: number): Promise<MediaArea[]>
  update(valorMedia: number, idarea: number, status: string, idmediaarea: number, transaction: Transaction): Promise<boolean>
  findByPk(idmediaarea: number, includeArea?: boolean): Promise<MediaArea>
  updateMedias(targetAreaId: number, idmediaarea: number, transaction: Transaction): Promise<number>
}
