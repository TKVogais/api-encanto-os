import { Request, Response } from "express";
import { IInventarioCachosController, IInventarioCachosService } from "../interfaces/inventariocachos";
import Controller from "../util/controller";

export class InventarioCachosController extends Controller implements IInventarioCachosController {
  constructor(private service: IInventarioCachosService) {
    super()
  }
  
  async gList(req: Request, res: Response): Promise<void> {
    res.json(await this.service.list());
  }

 
}
