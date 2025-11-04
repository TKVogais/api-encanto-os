import { Transaction } from "sequelize";
import { Pessoa } from "../entities/pessoa";
import { Request, Response } from "express";
import { CreatePessoaDto, ResCreatePessoaDto, ResUpdatePessoaDto } from "../DTOs/pessoas";

export interface IPessoaController {
   pCreate(req: Request, res: Response): Promise<void>;
   gList(req: Request, res: Response): Promise<void>;
   uUpdate(req: Request, res: Response): Promise<void>
}

export interface IPessoaService {
   create(pessoa: CreatePessoaDto, t?: Transaction): Promise<ResCreatePessoaDto>;
   list(): Promise<Pessoa[]>
   findByCNPJ(cpf_cnpj: string): Promise<Pessoa | null>
   update(pessoa: Pessoa): Promise<ResUpdatePessoaDto>
}

export interface IPessoaRepository {
   create(pessoa: CreatePessoaDto, t?: Transaction): Promise<Pessoa>
   list(): Promise<Pessoa[]>
   findByCNPJ(cpfcnpj: string): Promise<Pessoa | null>
   update(idbanco: number, pessoa: Partial<Pessoa>): Promise<boolean>
}