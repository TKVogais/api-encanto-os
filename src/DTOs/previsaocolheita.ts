import { PrevisaoColheita } from "../entities/precisaocolheita";
import { DefaultResponseApi } from "./defaults";

export class CreatePrevisaoColheitaDto {
  idprevisao?: number;
  idcortecoracao!: number;
  idarea!: number;
  idfita!: number;
  previsao!: number;
  semana!: number;
  ano!: number;
}

export class ResCreatePrevisaoColheitaDto extends DefaultResponseApi {
  previsaoColheita?: PrevisaoColheita;
}

export class ResUpdatePrevisaoColheitaDto extends ResCreatePrevisaoColheitaDto {}
