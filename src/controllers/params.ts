import { Request, Response } from "express";
import Controller from "../util/controller";
import { IParamsAnuaisController, IParamsAnuaisService } from "../interfaces/params";

export class ParamsAnuaisController extends Controller implements IParamsAnuaisController {
  constructor(private service: IParamsAnuaisService) {
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
