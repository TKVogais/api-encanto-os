import { Request, Response } from "express";
import { IPrevisaoColheitaController, IPrevisaoColheitaService } from "../interfaces/previsaocolheita";
import Controller from "../util/controller";

export class PrevisaoColheitaController extends Controller implements IPrevisaoColheitaController {
  constructor(private service: IPrevisaoColheitaService) {
    super();
  }

  async gList(req: Request, res: Response): Promise<void> {
    res.json(await this.service.list());
  }

  async gPrevisaoDashboard(req: Request, res: Response): Promise<void> {
    res.json(await this.service.findPrevisao());
  }

}
