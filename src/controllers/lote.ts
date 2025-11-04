import { Request, Response } from "express";
import { ILoteController, ILoteService } from "../interfaces/lotes";
import Controller from "../util/controller";

export class LotesController extends Controller implements ILoteController {
    constructor(private service: ILoteService) {
        super() 
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