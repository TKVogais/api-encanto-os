import { Request, Response } from "express";
import Controller from "../util/controller";
import { IResumoPrevisaoController, IResumoPrevisaoService } from "../interfaces/resumoprevisao";

export class ResumoPrevisaoController extends Controller implements IResumoPrevisaoController {
  constructor(private service: IResumoPrevisaoService) {
    super();
  }

  async gList(req: Request, res: Response): Promise<void> {
    res.json(await this.service.list());
  }
}
