import { MediaArea } from "../entities/mediasareas"
import { DefaultResponseApi } from "./defaults"

export class CreateMediaAreaDto {
  idmediaarea?: number
  media!: number
  idarea!: number
  status?: string
}

export class ResCreateMediaAreaDto extends DefaultResponseApi {
  mediaarea?: MediaArea
}

export class ResUpdateMediaAreaDto extends DefaultResponseApi {
  mediasareas?: MediaArea[]
}
