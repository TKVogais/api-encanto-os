import { Permissao } from "../entities/permissao"
import { DefaultResponseApi } from "./defaults"

export class CreatePermissaoDTO {
    idpermissao?: number
    permissao: string
    descricao: string
}

export class ResCreatePermissaoDto extends DefaultResponseApi {
    permissao?: Permissao
}

export class ResUpdatePermissaoDto extends ResCreatePermissaoDto{}
