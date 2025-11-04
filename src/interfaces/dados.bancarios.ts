import { Request, Response } from "express";
import { CreateBancoDto, ResCreateBancoDto, ResUpdateBancoDto } from "../DTOs/bancos";
import { Banco } from "../entities/bancos";

export interface IDadosBancariosController {
    pCreate(req: Request, res: Response): Promise<void>;
    gList(req: Request, res: Response): Promise<void>;
    uUpdate(req: Request, res: Response): Promise<void>
}

export interface IDadosBancariosService {
    create(banco: CreateBancoDto): Promise<ResCreateBancoDto>;
    list(): Promise<Banco[]>
    findByBanco(banco: string): Promise<Banco | null>
    update(banco: Banco): Promise<ResUpdateBancoDto>
}

export interface IDadosBancariosRepository {
    create(banco: CreateBancoDto): Promise<Banco>;
    list(): Promise<Banco[]>
    findByBanco(banco: string): Promise<Banco | null>
    update(idbanco: number, banco: Partial<Banco>): Promise<boolean>
}