import { Request, Response } from "express";
import { CreateAjusteFitaDto, ResCreateAjusteFitaDto } from "../DTOs/ajustesfitas";
import { AjusteFita } from "../entities/ajustesfitas";
import { Transaction } from "sequelize";

// Controller
export interface IAjustesFitasController {
  gList(req: Request, res: Response): Promise<void>;
  pBulkCreate(req: Request, res: Response): Promise<void>;
}

// Service
export interface IAjustesFitasService {
  bulkCreate(dataList: CreateAjusteFitaDto[]): Promise<ResCreateAjusteFitaDto>;
  list(): Promise<AjusteFita[]>;
}

// Repository
export interface IAjustesFitasRepository {
  bulkCreate(data: CreateAjusteFitaDto[], transaction: Transaction): Promise<AjusteFita[]>;
  list(): Promise<AjusteFita[]>;
}
