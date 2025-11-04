import { Request, Response } from "express";
import { IPessoaController, IPessoaService } from "../interfaces/pessoas"
import Controller from "../util/controller";

export class PessoaController extends Controller implements IPessoaController {
   constructor(private service: IPessoaService) {
      super();
   }
   async uUpdate(req: Request, res: Response): Promise<void> {
      res.json(await this.service.update(req.body));
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

