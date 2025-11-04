import { Request, Response } from "express";
import { CreateInventarioCachosDto, ListInventarioDto, ResCreateInventarioCachosDto, ResUpdateInventarioCachosDto, UpdateInventarioCachosDto } from "../DTOs/inventariocachos";
import { InventarioCachos } from "../entities/inventariocachos";
import { Transaction } from "sequelize";

export interface IInventarioCachosController {
  gList(req: Request, res: Response): Promise<void>;
}

export interface IInventarioCachosService {
  create(inventario: CreateInventarioCachosDto): Promise<ResCreateInventarioCachosDto>;
  list(): Promise<ListInventarioDto>;
  findAllByAreasEFitas(
    dataList: { idarea: number; idfita: number }[],
    transaction?: Transaction
  ): Promise<InventarioCachos[]>;
  update(inventario: InventarioCachos): Promise<ResUpdateInventarioCachosDto>;
  bulkCreate(dataList: CreateInventarioCachosDto[], transaction: Transaction): Promise<ResCreateInventarioCachosDto>;
  bulkUpdate(dataList: InventarioCachos[], transaction: Transaction): Promise<ResCreateInventarioCachosDto>;
}

export interface IInventarioCachosRepository {
  create(inventario: CreateInventarioCachosDto, transaction?: Transaction): Promise<InventarioCachos>;
  list(): Promise<InventarioCachos[]>;
  update(idinventario: number, inventario: Partial<InventarioCachos>, transaction?: Transaction): Promise<boolean>;
  bulkCreate(dataList: CreateInventarioCachosDto[], transaction?: Transaction): Promise<InventarioCachos[]>;
  bulkUpdate(dataList: UpdateInventarioCachosDto[], transaction?: Transaction): Promise<void>;
  findAllByAreasEFitas(
    dataList: { idarea: number; idfita: number }[],
    transaction?: Transaction
  ): Promise<InventarioCachos[]>;
}