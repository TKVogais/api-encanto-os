// src/interfaces/fitas.ts
import { Request, Response } from "express";
import { CreateFitaDto, ResCreateFitaDto, ResUpdateFitaDto } from "../DTOs/fitas";
import { Fita } from "../entities/fitas";

export interface IFitaController {
  pCreate(req: Request, res: Response): Promise<void>;
  gList(req: Request, res: Response): Promise<void>;
  uUpdate(req: Request, res: Response): Promise<void>;
}

export interface IFitaService {
  create(fita: CreateFitaDto): Promise<ResCreateFitaDto>;
  list(): Promise<Fita[]>;
  findByFita(fita: string): Promise<Fita | null>;
  update(fita: Fita): Promise<ResUpdateFitaDto>;
}

export interface IFitaRepository {
  create(fita: CreateFitaDto): Promise<Fita>;
  list(): Promise<Fita[]>;
  findByFita(fita: string): Promise<Fita | null>;
  update(idfita: number, fita: Partial<Fita>): Promise<boolean>;
}
