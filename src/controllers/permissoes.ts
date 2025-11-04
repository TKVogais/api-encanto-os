import { Request, Response } from "express";
import Controller from "../util/controller";
import { IPermissaoController, IPermissaoService } from "../interfaces/permissoes";

export class PermissoesController extends Controller implements IPermissaoController {
   constructor(private service: IPermissaoService) {
      super();
   }
   async uUpdate(req: Request, res: Response): Promise<void> {
     res.json(await this.service.update(req.body))
   }
   async pCreate(req: Request, res: Response): Promise<void> {
      const data = req.body
      const response = await this.service.create(data)
      res.json(response)
   }
   async gList(req: Request, res: Response): Promise<void> {
      res.json(await this.service.list())
   }

}

