import { Request, Response } from "express";
import Controller from "../util/controller";
import { IColheitaController, IColheitaService } from "../interfaces/colheita";

export class ColheitasController extends Controller implements IColheitaController {
  
  constructor(private service: IColheitaService) {
    super();
  }
  async gListMediasColheitas(req: Request, res: Response): Promise<void> {
    res.json(await this.service.findMediasColheitasAreas());
  }
  async gListColheitasHect(req: Request, res: Response): Promise<void> {
    res.json(await this.service.findColheitasHectares());
  }

  async pCreate(req: Request, res: Response): Promise<void> {
    res.json(await this.service.create(req.body));
  }

  async pCreateBulk(req: Request, res: Response): Promise<void> {
    res.json(await this.service.bulkCreate(req.body));
  }

  async gList(req: Request, res: Response): Promise<void> {
    res.json(await this.service.list());
  }

  async uUpdate(req: Request, res: Response): Promise<void> {
    res.json(await this.service.update(req.body));
  }
}
