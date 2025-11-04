import { Request, Response } from "express";
import { CreateAreaDto, ResCreateAreaDto, ResUpdateAreaDto } from "../DTOs/areas";
import { Area } from "../entities/areas";

export interface IAreaController {
  pCreate(req: Request, res: Response): Promise<void>;
  gList(req: Request, res: Response): Promise<void>;
  uUpdate(req: Request, res: Response): Promise<void>;
}

export interface IAreaService {
  create(area: CreateAreaDto): Promise<ResCreateAreaDto>;
  list(): Promise<Area[]>;
  findByArea(area: string): Promise<Area | null>;
  update(area: Area): Promise<ResUpdateAreaDto>;
}

export interface IAreaRepository {
  create(area: CreateAreaDto): Promise<Area>;
  list(): Promise<Area[]>;
  findByArea(area: string): Promise<Area | null>;
  update(idarea: number, area: Partial<Area>): Promise<boolean>;
}
