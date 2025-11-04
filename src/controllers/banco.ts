import { Request, Response } from "express";
import { IBancoController, IBancoService } from "../interfaces/bancos";
import Controller from "../util/controller";

export class BancoController extends Controller implements IBancoController {

    constructor(private service: IBancoService) {
        super();
    }

    async pCreate(req: Request, res: Response): Promise<void> {
        res.json(await this.service.create(req.body))
    }
    async gList(req: Request, res: Response): Promise<void> {
        res.json(await this.service.list())
    }
    async uUpdate(req: Request, res: Response): Promise<void> {
        res.json(await this.service.update(req.body))
    }

}