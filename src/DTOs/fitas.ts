// src/DTOs/fitas.ts
import { Fita } from "../entities/fitas";
import { DefaultResponseApi } from "./defaults";

export class CreateFitaDto {
  idfita?: number;
  fita!: string;
  hex!: string;
}

export class ResCreateFitaDto extends DefaultResponseApi {
  fita?: Fita;
}

export class ResUpdateFitaDto extends ResCreateFitaDto {}
