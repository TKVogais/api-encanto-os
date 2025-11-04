import { Request, Response } from "express";
import Controller from "../util/controller";
import { IAjustesFitasController, IAjustesFitasService } from "../interfaces/ajustesfitas";

export class AjustesFitasController extends Controller implements IAjustesFitasController {
  constructor(private service: IAjustesFitasService) {
    super();
  }

  async gList(req: Request, res: Response): Promise<void> {
    res.json(await this.service.list());
  }

  async pBulkCreate(req: Request, res: Response): Promise<void> {
    res.json(await this.service.bulkCreate(req.body));
  }
}
