import { Permissao } from "../entities/permissao"
import { Pessoa } from "../entities/pessoa"
import { DefaultResponseApi } from "./defaults"
import { CreatePessoaDto } from "./pessoas"

export class CreateUsuarioDto {
  idusuario?: number
  usuario: string
  senha: string
  idpessoa?: number
  pessoa?: CreatePessoaDto
  tipousuario: string
  status: string
  alterarSenha?: boolean
}

export class ResCreateUsuarioDto extends DefaultResponseApi {
  usuario?: {
    idusuario: number
    usuario: string
    idpessoa?: number
    tipousuario: string
    status: string
    senha: string
    permissoes: Permissao[]
  }
}

export class FindUserWithPerm {
  idusuario: number;
  usuario: string;
  status: string;
  tipousuario: string
  senha: string
  permissoes: {
    idpermissao: number;
    permissao: string;
    descricao: string;
  }[];
  pessoa: {
    idpessoa: number;
    name: string;
    email: string;
    sobrenome: string;
    urlimage: string;
  } | null;
}

export class UsuariosDto {
  idusuario: number;
  usuario: string;
  status: string;
  tipousuario: string
  senha: string
  permissoes: {
    idpermissao: number;
    permissao: string;
    descricao: string;
  }[];
  pessoa: {
    idpessoa: number;
    name: string;
    email: string;
    sobrenome: string;
    urlimage: string;
  } | null;
}

export class UpdatePermissoesDto {
  idusuario: number
  permissoes: {
    idpermissao: number,
    idusuario: number
  }[]
}