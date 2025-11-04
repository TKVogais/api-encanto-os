import { ResumoColheita } from "../entities/resumocolheita";

export interface CreateResumoColheitaDto {
  mes: number;
  ano: number;
  cachos: number;
  kgcolhidos: number;
  media: number;
  idarea: number
}

export interface ResCreateResumoColheitaDto {
  status: number;
  message: string;
  resumo?: ResumoColheita;
}

export interface ResUpdateResumoColheitaDto {
  status: number;
  message: string;
  resumo?: ResumoColheita | null;
}

export interface FindByParamsDto {
  mes: number
  ano: number
  idarea: number
}