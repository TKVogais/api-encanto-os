import { Request, Response } from "express";
import { ResumoColheita } from "../entities/resumocolheita";
import { CreateResumoColheitaDto, FindByParamsDto, ResUpdateResumoColheitaDto } from "../DTOs/resumocolheita";
import { ResCreateColheitaDto } from "../DTOs/colheita";
import { Transaction } from "sequelize";

export interface IResumoColheitaController {
  pCreate(req: Request, res: Response): Promise<void>;
  gList(req: Request, res: Response): Promise<void>;
  uUpdate(req: Request, res: Response): Promise<void>;
}

export interface IResumoColheitaService {
  create(dto: CreateResumoColheitaDto, transaction: Transaction): Promise<ResCreateColheitaDto>;
  list(): Promise<ResumoColheita[]>;
  listByYear(ano: number): Promise<ResumoColheita[]>;
  update(dto: ResumoColheita, transaction: Transaction): Promise<ResUpdateResumoColheitaDto>;
  findByParams(params: FindByParamsDto, transaction: Transaction): Promise<ResumoColheita | null>
  listByBetweenYearMonth(): Promise<ResumoColheita[]>
}

export interface IResumoColheitaRepository {
  create(dto: CreateResumoColheitaDto, transaction: Transaction): Promise<ResumoColheita>;
  listByYear(ano: number): Promise<ResumoColheita[]>;
  list(): Promise<ResumoColheita[]>;
  update(idcolheita: number, dto: Partial<ResumoColheita>, transaction: Transaction): Promise<boolean>;
  findByParams(params: FindByParamsDto, transaction: Transaction): Promise<ResumoColheita | null>
  listByBetweenYearMonth(mesInicial: number, mesFinal: number, anoInicial: number, anoFinal: number): Promise<ResumoColheita[]>
}
