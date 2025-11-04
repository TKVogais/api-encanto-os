import { Colheita } from "../entities/colheita";

export interface CreateColheitaDto {
  mes: number;
  semana: number;
  ano: number;
  cxs: number;
  data: Date
  cachos: number;
  pesocx: number;
  kgcolhidos: number;
  media: number;
  idarea: number;
}

export interface ResCreateColheitaDto {
  status: number;
  message: string;
  colheita?: Colheita;
}

export interface ResUpdateColheitaDto {
  status: number;
  message: string;
  colheita?: Colheita | null;
}

export interface ColheitasHectares {
  total: number,
  area: string,
  mes: number
}

export interface MediaColheita {
  kgcolhidos: number,
  cachos: number,
  area: string,
  mes: number
}