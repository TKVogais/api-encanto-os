import { Request, Response } from "express";
import Controller from "../util/controller";
import { IResumoColheitaController, IResumoColheitaService } from "../interfaces/resumocolheita";

export class ResumoColheitaController extends Controller implements IResumoColheitaController {
  constructor(private service: IResumoColheitaService) {
    super();
  }

  async pCreate(req: Request, res: Response): Promise<void> {
    res.json(await this.service.create(req.body));
  }

  async gList(req: Request, res: Response): Promise<void> {
    res.json(await this.service.list());
  }

  async uUpdate(req: Request, res: Response): Promise<void> {
    res.json(await this.service.update(req.body));
  }
}
