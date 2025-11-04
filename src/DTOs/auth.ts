import { Permissao } from "../entities/permissao"
import { DefaultResponseApi } from "./defaults"
import { UsuariosDto } from "./usuarios"

export class AuthDto {
    usuario: string
    senha: string
}

export class ResAuthDto extends DefaultResponseApi {
    usuario?: UsuariosDto
    token?: string
    permissoes?: Permissao[]
}

export class ResAutenticateDto {
    isAuthenticaded: boolean
    permissoes: Permissao[]
}