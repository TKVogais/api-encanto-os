import { Request, Response } from "express";
import { CreateParamsAnuaisDto, ResCreateParamsAnuaisDto, ResUpdateParamsAnuaisDto } from "../DTOs/params";
import { ParamsAnuais } from "../entities/params";
import { Transaction } from "sequelize";

export interface IParamsAnuaisController {
  pCreate(req: Request, res: Response): Promise<void>;
  gList(req: Request, res: Response): Promise<void>;
  uUpdate(req: Request, res: Response): Promise<void>;
}

export interface IParamsAnuaisService {
  create(data: CreateParamsAnuaisDto): Promise<ResCreateParamsAnuaisDto>;
  list(): Promise<ParamsAnuais[]>;
  update(data: ParamsAnuais, transaction?: Transaction): Promise<ResUpdateParamsAnuaisDto>;
  findByYear(year: number): Promise<ParamsAnuais>
}

export interface IParamsAnuaisRepository {
  create(data: CreateParamsAnuaisDto): Promise<ParamsAnuais>;
  list(): Promise<ParamsAnuais[]>;
  update(idparam: number, data: Partial<ParamsAnuais>, transaction: Transaction): Promise<boolean>;
  findByYear(year: number): Promise<ParamsAnuais | null>
}
