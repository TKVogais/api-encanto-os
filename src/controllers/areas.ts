import { Request, Response } from "express";
import Controller from "../util/controller";
import { IAreaController, IAreaService } from "../interfaces/areas";

export class AreasController extends Controller implements IAreaController {
    constructor(private service: IAreaService) {
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
