import { Request, Response } from "express";
import Controller from "../util/controller";

export class HealthController extends Controller {
    constructor() {
        super()
    }

    async gHealth(req: Request, res: Response): Promise<void> {
        res.status(200).json()
    }

}
