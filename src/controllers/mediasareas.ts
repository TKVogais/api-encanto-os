// controllers/mediasareas.ts
import { Request, Response } from "express"
import { IMediaAreaController, IMediaAreaService } from "../interfaces/mediasareas"
import Controller from "../util/controller"

export class MediasAreasController extends Controller implements IMediaAreaController {
  constructor(private service: IMediaAreaService) {
    super()
  }

  async pCreate(req: Request, res: Response): Promise<void> {
    res.json(await this.service.create(req.body))
  }

  async gList(req: Request, res: Response): Promise<void> {
    res.json(await this.service.list())
  }

  async uUpdate(req: Request, res: Response): Promise<void> {
    res.json(await this.service.update(req.body))
  }
}
