import { AjusteFita } from "../entities/ajustesfitas";

export interface CreateAjusteFitaDto {
  idfita: number;
  idarea: number;
  data: Date;
  cachos: number;
  kgajustado: number;
}

export interface ResCreateAjusteFitaDto {
  status: number;
  message: string;
  ajustes?: AjusteFita[];
}
