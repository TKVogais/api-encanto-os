import { ParamsAnuais } from "../entities/params";

export interface CreateParamsAnuaisDto {
  ano: number;
  meta: number;
  percenmeta: number;
  colhido: number;
  previsto: number;
  mediacacho: number;
}

export interface ResCreateParamsAnuaisDto {
  status: number;
  message: string;
  param?: ParamsAnuais;
}

export interface ResUpdateParamsAnuaisDto {
  status: number;
  message: string;
  param?: ParamsAnuais | null;
}
