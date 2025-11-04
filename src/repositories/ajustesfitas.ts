import { Model, ModelStatic } from "sequelize";
import { IAjustesFitasRepository } from "../interfaces/ajustesfitas";
import { CreateAjusteFitaDto } from "../DTOs/ajustesfitas";
import { AjusteFita } from "../entities/ajustesfitas";

export class AjustesFitasRepository implements IAjustesFitasRepository {
  private model: ModelStatic<Model<any, any>>;

  static readonly ERROR_MODEL_REQUIRED = "É necessário fornecer uma model.";

  constructor(model: ModelStatic<Model<any, any>>) {
    if (!model) throw new Error(AjustesFitasRepository.ERROR_MODEL_REQUIRED);
    this.model = model;
  }

  async bulkCreate(data: CreateAjusteFitaDto[]): Promise<AjusteFita[]> {
    const created = await this.model.bulkCreate(data as any);
    return created.map(r => r.dataValues as AjusteFita);
  }

  async list(): Promise<AjusteFita[]> {
    const records = await this.model.findAll();
    return records.map(r => r.dataValues as AjusteFita);
  }
}
