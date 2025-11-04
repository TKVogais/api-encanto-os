import { CorteCoracao } from "../entities/cortecoracao";
import { DefaultResponseApi } from "./defaults";

export class CreateCorteCoracaoDto {
  idcortecoracao?: number;
  datacorte!: Date;
  idarea!: number;
  idfita!: number;
  coracoes!: number;
  semanacorte!: number;
  anocorte!: number;
  anoprevisao?: number
  semanaprevisao?: number
  previsao?: number
}

export class CreateRepo {
  idcortecoracao?: number;
  datacorte!: Date;
  idarea!: number;
  idfita!: number;
  coracoes!: number;
  semana!: number;
  ano!: number;
}

export class ResCreateCorteCoracaoDto extends DefaultResponseApi {
  cortecoracao?: CorteCoracao;
}

export class ResUpdateCorteCoracaoDto extends ResCreateCorteCoracaoDto {
  cortecoracao?: CorteCoracao;
}
