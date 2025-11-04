// src/repositories/fitas.ts
import { Model, ModelStatic } from "sequelize";
import { IFitaRepository } from "../interfaces/fitas";
import { Fita } from "../entities/fitas";
import { CreateFitaDto } from "../DTOs/fitas";

export class FitasRepository implements IFitaRepository {
  constructor(private model: ModelStatic<Model<any, any>>) {}

  async create(fita: CreateFitaDto): Promise<Fita> {
    const { dataValues } = await this.model.create(fita as any);
    return dataValues as Fita;
  }

  async list(): Promise<Fita[]> {
    const records = await this.model.findAll();
    return records.map(r => r.dataValues as Fita);
  }

  async findByFita(fita: string): Promise<Fita | null> {
    const record = await this.model.findOne({ where: { fita } });
    return record?.dataValues as Fita || null;
  }

  async update(idfita: number, fita: Partial<Fita>): Promise<boolean> {
    const [affectedCount] = await this.model.update(fita, { where: { idfita } });
    return affectedCount > 0;
  }
}
