import { Area } from "../entities/areas";
import { DefaultResponseApi } from "./defaults";

export class CreateAreaDto {
  idarea?: number;
  idlote!: number;
  hect!: number;
  hectplant!: number;
  plantas!: number;
  area: string
}

export class ResCreateAreaDto extends DefaultResponseApi {
  area?: Area;
}

export class ResUpdateAreaDto extends ResCreateAreaDto {}
