import { Request, Response } from "express";
import { CreatePrevisaoColheitaDto, ResCreatePrevisaoColheitaDto, ResUpdatePrevisaoColheitaDto } from "../DTOs/previsaocolheita";
import { PrevisaoColheita } from "../entities/precisaocolheita";
import { Transaction } from "sequelize";

export interface IPrevisaoColheitaController {
  gList(req: Request, res: Response): Promise<void>;
}

export interface IPrevisaoColheitaService {
  create(previsao: CreatePrevisaoColheitaDto, transaction: Transaction): Promise<ResCreatePrevisaoColheitaDto>;
  list(): Promise<PrevisaoColheita[]>;
  update(previsao: PrevisaoColheita, transaction: Transaction): Promise<ResUpdatePrevisaoColheitaDto>;
  findPrevisao(): Promise<any>
  bulkCreate(dataList: CreatePrevisaoColheitaDto[], transaction: Transaction): Promise<ResCreatePrevisaoColheitaDto>
}

export interface IPrevisaoColheitaRepository {
  create(previsao: CreatePrevisaoColheitaDto, transaction: Transaction): Promise<PrevisaoColheita>;
  list(): Promise<PrevisaoColheita[]>;
  update(idcortecoracao: number, previsao: Partial<PrevisaoColheita>, transaction: Transaction): Promise<boolean>;
  findByPk(idprevisao: number): Promise<PrevisaoColheita | null>;
  bulkCreate(dataList: Partial<PrevisaoColheita>[], transaction: Transaction): Promise<PrevisaoColheita[]>;

}
