import { Request, Response } from "express";
import { Colheita } from "../entities/colheita";
import { ColheitasHectares, CreateColheitaDto, MediaColheita, ResCreateColheitaDto, ResUpdateColheitaDto } from "../DTOs/colheita";
import { Transaction } from "sequelize";

export interface IColheitaController {
  pCreate(req: Request, res: Response): Promise<void>;
  pCreateBulk(req: Request, res: Response): Promise<void>;
  gList(req: Request, res: Response): Promise<void>;
  uUpdate(req: Request, res: Response): Promise<void>;
  gListColheitasHect(req: Request, res: Response): Promise<void>;
  gListMediasColheitas(req: Request, res: Response): Promise<void>;
}

export interface IColheitaService {
  create(colheita: CreateColheitaDto): Promise<ResCreateColheitaDto>;
  bulkCreate(colheita: CreateColheitaDto[]): Promise<ResCreateColheitaDto>;
  list(): Promise<Colheita[]>;
  update(colheita: Colheita): Promise<ResUpdateColheitaDto>;
  findByParams(idarea: number, data: Date): Promise<Colheita | null>;
  findColheitasHectares(): Promise<ColheitasHectares[]>
  findMediasColheitasAreas(): Promise<MediaColheita[]>
}

export interface IColheitaRepository {
  create(colheita: CreateColheitaDto, transaction: Transaction): Promise<Colheita>;
  bulkCreate(colheitas: CreateColheitaDto[], transaction: Transaction): Promise<Colheita[]>;
  list(): Promise<Colheita[]>;
  update(idcolheita: number, colheita: Partial<Colheita>, transaction: Transaction): Promise<boolean>;
  findByParams(idarea: number, data: Date): Promise<Colheita | null>;
  findDuplicates(dataList: CreateColheitaDto[], transaction: Transaction): Promise<Colheita[]>;
  findColheitasHectares(ano: number): Promise<ColheitasHectares[]>
  findMediasColheitasAreas(ano: number): Promise<MediaColheita[]>
}