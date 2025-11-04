import { Lote } from "../entities/lotes"
import { DefaultResponseApi } from "./defaults"

export class CreateLoteDto {
    idlote?: number
    lote: string
    descricao: string
}

export class ResCreateLoteDto extends DefaultResponseApi{
    lote?: Lote
}

export class ResUpdateLoteDto extends ResCreateLoteDto{}