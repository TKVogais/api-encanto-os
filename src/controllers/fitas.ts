// src/controllers/fitas.ts
import { Request, Response } from "express";
import { IFitaController, IFitaService } from "../interfaces/fitas";
import Controller from "../util/controller";

export class FitasController extends Controller implements IFitaController {
  constructor(private service: IFitaService) {
    super()
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
