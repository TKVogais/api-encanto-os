import { Request, Response } from "express";
import { Banco } from "../entities/bancos";
import { CreateLoteDto, ResCreateLoteDto, ResUpdateLoteDto } from "../DTOs/lotes";
import { Lote } from "../entities/lotes";

export interface ILoteController {
   pCreate(req: Request, res: Response): Promise<void>;
   gList(req: Request, res: Response): Promise<void>;
   uUpdate(req: Request, res: Response): Promise<void>
}

export interface ILoteService {
   create(lote: CreateLoteDto): Promise<ResCreateLoteDto>;
   list(): Promise<Lote[]>
   findByLote(lote: string): Promise<Lote | null>
   update(lote: Lote): Promise<ResUpdateLoteDto>
}

export interface ILoteRepository {
   create(lote: CreateLoteDto): Promise<Lote>;
   list(): Promise<Lote[]>
   findByLote(lote: string): Promise<Lote | null>
   update(idlote: number, lote: Partial<Lote>): Promise<boolean>
}