import { Request, Response } from "express";
import { CreatePermissaoDTO, ResCreatePermissaoDto, ResUpdatePermissaoDto } from "../DTOs/permissao";
import { Permissao } from "../entities/permissao";

export interface IPermissaoController {
    pCreate(req: Request, res: Response): Promise<void>;
    gList(req: Request, res: Response): Promise<void>;
    uUpdate(req: Request, res: Response): Promise<void>;
}

export interface IPermissaoService {
    create(permissao: CreatePermissaoDTO): Promise<ResCreatePermissaoDto>;
    list(): Promise<Permissao[]>
    findByPermissao(permissao: string): Promise<Permissao | null>
    update(permissao: Permissao): Promise<ResUpdatePermissaoDto>;
}

export interface IPermissaoRepository {
    create(permissao: CreatePermissaoDTO): Promise<Permissao>
    list(): Promise<Permissao[]>
    findByPermissao(permissao: string): Promise<Permissao | null>
    update(idpermissao: number, permissao: Partial<Permissao>): Promise<boolean>
}