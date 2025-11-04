import { Request, Response } from "express";
import { ResumoPrevisao } from "../entities/resumoprevisao";
import { CreateResumoPrevisaoDto, FindByParamsDto, ResCreateResumoPrevisaoDto, ResUpdateResumoPrevisaoDto } from "../DTOs/resumoprevisao";
import { Transaction } from "sequelize";
import { CorteCoracao } from "../entities/cortecoracao";

export interface IResumoPrevisaoController {
  gList(req: Request, res: Response): Promise<void>;
}

export interface IResumoPrevisaoService {
  create(dto: CreateResumoPrevisaoDto, transaction: Transaction): Promise<ResCreateResumoPrevisaoDto>;
  list(): Promise<ResumoPrevisao[]>;
  update(resumo: ResumoPrevisao, transaction: Transaction): Promise<ResUpdateResumoPrevisaoDto>;
  findByParms(params: FindByParamsDto, transaction: Transaction): Promise<ResumoPrevisao | null>
  findPrevisao(): Promise<any>
  listByBetweenYearMonth(): Promise<ResumoPrevisao[]>
  listResumoCoracoes(): Promise<CorteCoracao[]>
}

export interface IResumoPrevisaoRepository {
  create(dto: CreateResumoPrevisaoDto, transaction: Transaction): Promise<ResumoPrevisao>;
  list(): Promise<ResumoPrevisao[]>;
  update(idresumo: number, resumo: Partial<ResumoPrevisao>, transaction: Transaction): Promise<boolean>;
  findByParms(params: FindByParamsDto, transaction: Transaction): Promise<ResumoPrevisao | null>
  listByBetweenYearMonth(mesInicial: number, mesFinal: number, anoInicial: number, anoFinal: number): Promise<ResumoPrevisao[]>
  listResumoCoracoes(): Promise<CorteCoracao[]>
}