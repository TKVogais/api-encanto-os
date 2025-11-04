import { Request, Response } from "express";
import Controller from "../util/controller";
import { IUsuarioController, IUsuarioService } from "../interfaces/usuarios";
import { UpdatePermissoesDto } from "../DTOs/usuarios";

export class UsuarioController extends Controller implements IUsuarioController {
   constructor(private service: IUsuarioService) {
      super();
   }
   async uUpdatePermissoes(req: Request, res: Response): Promise<void> {
      const permissoesDto: UpdatePermissoesDto = req.body;
      res.json(await this.service.updatePermissoes(permissoesDto));
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

