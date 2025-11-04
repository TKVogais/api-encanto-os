import { Request, Response } from "express";
import { CreateCorteCoracaoDto, CreateRepo, ResCreateCorteCoracaoDto, ResUpdateCorteCoracaoDto } from "../DTOs/cortecoracao";
import { CorteCoracao } from "../entities/cortecoracao";
import { Transaction } from "sequelize";

export interface ICorteCoracoesController {
  pCreate(req: Request, res: Response): Promise<void>;
  gList(req: Request, res: Response): Promise<void>;
  uUpdate(req: Request, res: Response): Promise<void>;
}

export interface ICorteCoracoesService {
  bulkCreate(dataList: CreateCorteCoracaoDto[]): Promise<ResCreateCorteCoracaoDto>;
  list(): Promise<CorteCoracao[]>;
  update(data: CreateCorteCoracaoDto): Promise<ResUpdateCorteCoracaoDto>;
}

export interface ICorteCoracoesRepository {
 
  create(data: CreateRepo, transaction: Transaction): Promise<CorteCoracao>;
  bulkCreate(dataList: CreateRepo[], transaction: Transaction): Promise<CorteCoracao[]>;
  list(): Promise<CorteCoracao[]>;
  update(idcortecoracao: number, data: CreateRepo, transaction: Transaction): Promise<boolean>;
  findByParams(idarea: number, idfita: number, semana: number, ano: number): Promise<CorteCoracao | null>;
  findDuplicates(dataList: CreateCorteCoracaoDto[], transaction: Transaction): Promise<CorteCoracao[]>;
}
