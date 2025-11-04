import { Model, ModelStatic, Transaction } from "sequelize";
import { IParamsAnuaisRepository } from "../interfaces/params";
import { CreateParamsAnuaisDto } from "../DTOs/params";
import { ParamsAnuais } from "../entities/params";

export class ParamsAnuaisRepository implements IParamsAnuaisRepository {
  private model: ModelStatic<Model<any, any>>;
  static readonly ERROR_MODEL_REQUIRED = "É necessário fornecer uma model.";

  constructor(model: ModelStatic<Model<any, any>>) {
    if (!model) throw new Error(ParamsAnuaisRepository.ERROR_MODEL_REQUIRED);
    this.model = model;
  }
  async findByYear(year: number): Promise<ParamsAnuais | null> {
    const record =  await this.model.findOne({ where: { ano: year } })
    return record?.dataValues as ParamsAnuais || null;
  }

  async create(data: CreateParamsAnuaisDto): Promise<ParamsAnuais> {
    const { dataValues } = await this.model.create(data as any);
    return dataValues as ParamsAnuais;
  }

  async list(): Promise<ParamsAnuais[]> {
    const records = await this.model.findAll();
    return records.map((r) => r.dataValues as ParamsAnuais);
  }

  async update(idparam: number, data: Partial<ParamsAnuais>, transaction: Transaction): Promise<boolean> {
    const [affected] = await this.model.update(data, { where: { idparam }, transaction });
    return affected > 0;
  }
}
