import { Pessoa } from "../entities/pessoa"
import { DefaultResponseApi } from "./defaults"

export class CreatePessoaDto {
  name: string;
  sobrenome: string;
  tipopessoa: string;
  cpfcnpj: string;
  logradouro: string;
  cep: string;
  cidade: string;
  estado: string;
  numero: string;
  email: string;
  telefone: string;
  urlimage?: string; // opcional, pode ser definido depois
  datanasc: Date;
  estadocivil: string;
  bairro: string;
}


export class ResCreatePessoaDto extends DefaultResponseApi {
    pessoa?: Pessoa
}

export class ResUpdatePessoaDto extends ResCreatePessoaDto {
   
}
