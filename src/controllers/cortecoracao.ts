import { Request, Response } from "express";
import Controller from "../util/controller";
import { ICorteCoracoesController, ICorteCoracoesService } from "../interfaces/cortecoracao";

export class CorteCoracoesController extends Controller implements ICorteCoracoesController {
  constructor(private service: ICorteCoracoesService) {
    super();
  }

  async pCreate(req: Request, res: Response): Promise<void> {
    res.json(await this.service.bulkCreate(req.body));
  }

  async gList(req: Request, res: Response): Promise<void> {
    res.json(await this.service.list());
  }

  async uUpdate(req: Request, res: Response): Promise<void> {
    res.json(await this.service.update(req.body));
  }
}
