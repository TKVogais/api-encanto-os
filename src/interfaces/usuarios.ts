import { CreateUsuarioDto, FindUserWithPerm, ResCreateUsuarioDto, UpdatePermissoesDto, UsuariosDto } from "../DTOs/usuarios";
import { Request, Response } from "express";
import { Usuario } from "../entities/usuario";
import { Transaction } from "sequelize";
import { DefaultResponseApi } from "../DTOs/defaults";

export interface IUsuarioController {
   pCreate(req: Request, res: Response): Promise<void>;
   gList(req: Request, res: Response): Promise<void>;
   uUpdate(req: Request, res: Response): Promise<void>;
   uUpdatePermissoes(req: Request, res: Response): Promise<void>;
}
export interface IUsuarioService {
   create(usuario: CreateUsuarioDto): Promise<ResCreateUsuarioDto>;
   list(): Promise<UsuariosDto[]>
   findByUser(usuario: string): Promise<Usuario | null>
   findByUserWithPermissoes(usuario: string): Promise<FindUserWithPerm>
   update(usuario: CreateUsuarioDto): Promise<ResCreateUsuarioDto>;
   updatePermissoes(permissoesDto: UpdatePermissoesDto): Promise<DefaultResponseApi>
}

export interface IUsuarioRepository {
   create(usuario: CreateUsuarioDto, t?: Transaction): Promise<Usuario>
   list(): Promise<UsuariosDto[]>
   findByUser(usuario: string): Promise<Usuario | null>
   findByUserWithPermissoes(usuario: string): Promise<FindUserWithPerm>
   update(idusuario: number, usuario: Partial<Usuario>): Promise<boolean>;
   updatePermissoes(permissoes: UpdatePermissoesDto, t: Transaction): Promise<boolean>
   deletePermissoes(idusuario: number, t: Transaction): Promise<boolean>
}