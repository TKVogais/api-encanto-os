import { InventarioCachos } from "../entities/inventariocachos";
import { ParamsAnuais } from "../entities/params";

export interface CreateInventarioCachosDto {
  idarea: number;
  idfita: number;
  coracoes: number;
  ajustes: number;
  colhidos: number;
  total: number;
}
export interface UpdateInventarioCachosDto {
  idinventario: number
  idarea: number;
  idfita: number;
  coracoes: number;
  ajustes: number;
  colhidos: number;
  total: number;
}

export interface ResCreateInventarioCachosDto {
  status: number;
  message: string;
  inventario?: InventarioCachos;
}

export interface ResUpdateInventarioCachosDto {
  status: number;
  message: string;
  inventario?: InventarioCachos | null;
}

export interface ListInventarioDto {
  inventario: InventarioCachos[],
  params: ParamsAnuais
}