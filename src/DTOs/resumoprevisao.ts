import { ResumoPrevisao } from "../entities/resumoprevisao";

export interface CreateResumoPrevisaoDto {
  coracoes: number;
  previsao: number;
  semanaprev: number;
  mes: number;
  anoprev: number;
  semanacorte: number;
  anocorte: number
  idfita: number
}

export interface ResCreateResumoPrevisaoDto {
  status: number;
  message: string;
  resumo?: ResumoPrevisao;
}

export interface ResUpdateResumoPrevisaoDto {
  status: number;
  message: string;
  resumo?: ResumoPrevisao | null;
}

export interface FindByParamsDto{
  semanacorte: number,
  semanaprev: number,
  anoprev: number
  anocorte: number
}