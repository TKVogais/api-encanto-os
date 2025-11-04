import { Model, ModelStatic, Transaction } from "sequelize";
import { IResumoColheitaRepository } from "../interfaces/resumocolheita";
import { CreateResumoColheitaDto, FindByParamsDto } from "../DTOs/resumocolheita";
import { ResumoColheita } from "../entities/resumocolheita";
import { Op } from "sequelize";
import sequelize from "../sequelize/config/config";

export class ResumoColheitaRepository implements IResumoColheitaRepository {
  private model: ModelStatic<Model<any, any>>;

  static readonly ERROR_MODEL_REQUIRED = "É necessário fornecer uma model.";

  constructor(model: ModelStatic<Model<any, any>>) {
    if (!model) throw new Error(ResumoColheitaRepository.ERROR_MODEL_REQUIRED);
    this.model = model;
  }
  async findByParams(params: FindByParamsDto, transaction: Transaction): Promise<ResumoColheita | null> {
    const record = await this.model.findOne({
      where: { ...params },
      transaction
    });
    return record?.dataValues as ResumoColheita || null;
  }

  async create(dto: CreateResumoColheitaDto): Promise<ResumoColheita> {
    const { dataValues } = await this.model.create(dto as any);
    return dataValues as ResumoColheita;
  }

  async list(): Promise<ResumoColheita[]> {
    const records = await this.model.findAll({ include: "area" });
    return records.map((r) => r.dataValues as ResumoColheita);
  }

  async update(idresumo: number, dto: Partial<ResumoColheita>): Promise<boolean> {
    const [affectedCount] = await this.model.update(dto, { where: { idresumo } });
    return affectedCount > 0;
  }
  async listByYear(ano: number): Promise<ResumoColheita[]> {
    const records = await this.model.findAll(
      {
        where: { ano },
        include: "area"
      }
    );
    return records.map((r) => r.dataValues as ResumoColheita);
  }

  async listByBetweenYearMonth(mesInicial: number, mesFinal: number, anoInicial: number, anoFinal: number): Promise<ResumoColheita[]> {
    const valorInicial = anoInicial * 100 + mesInicial;
    const valorFinal = anoFinal * 100 + mesFinal;

    const records = await this.model.findAll({
      where: sequelize.literal(`(ano * 100 + mes) BETWEEN ${valorInicial} AND ${valorFinal}`),
      include: "area"
    });
    return records.map((r) => r.dataValues as ResumoColheita);
  }
}
