import { Banco } from "../entities/bancos"
import { DefaultResponseApi } from "./defaults"

export class CreateBancoDto {
    idbanco?: number
    banco: string
    codigo: string
    cnpj: string
    urlimage: string
}

export class ResCreateBancoDto extends DefaultResponseApi {
    banco?: Banco
}

export class ResUpdateBancoDto extends ResCreateBancoDto{
   
}