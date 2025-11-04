import { Model, ModelStatic, Op, Transaction } from "sequelize";
import { ICorteCoracoesRepository } from "../interfaces/cortecoracao";
import { CreateCorteCoracaoDto, CreateRepo } from "../DTOs/cortecoracao";
import { CorteCoracao } from "../entities/cortecoracao";

export class CorteCoracoesRepository implements ICorteCoracoesRepository {
  private model: ModelStatic<Model<any, any>>;
  static readonly ERROR_MODEL_REQUIRED = "É necessário fornecer uma model.";

  constructor(model: ModelStatic<Model<any, any>>) {
    if (!model) throw new Error(CorteCoracoesRepository.ERROR_MODEL_REQUIRED);
    this.model = model;
  }

  // Busca um registro específico
  async findByParams(idarea: number, idfita: number, semana: number, ano: number): Promise<CorteCoracao | null> {
    const record = await this.model.findOne({
      where: { idarea, idfita, semana, ano }
    });
    return record?.dataValues as CorteCoracao || null;
  }

  // Cria um registro
  async create(data: CreateRepo, transaction: Transaction): Promise<CorteCoracao> {
    const { dataValues } = await this.model.create(data as any, { transaction });
    return dataValues as CorteCoracao;
  }

  // Cria múltiplos registros de uma vez (bulkCreate)
  async bulkCreate(dataList: CreateRepo[], transaction: Transaction): Promise<CorteCoracao[]> {
    const records = await this.model.bulkCreate(dataList as any[], { transaction });
    return records.map(r => r.dataValues as CorteCoracao);
  }

  // Lista todos os registros
  async list(): Promise<CorteCoracao[]> {
    const records = await this.model.findAll({
      include: ["area", "fita"],
      order: [["idcortecoracao", "DESC"]], // ordena pelo ID decrescente
      limit: 225,                   // pega só os 100 últimos
    });
    return records.map(r => r.dataValues as CorteCoracao);
  }

  // Atualiza um registro específico
  async update(idcortecoracao: number, data: CreateRepo, transaction: Transaction): Promise<boolean> {
    const [affected] = await this.model.update(data, { where: { idcortecoracao }, transaction });
    return affected > 0;
  }

  // 🔹 Novo método: encontra todos os duplicados em lote
  async findDuplicates(dataList: CreateCorteCoracaoDto[], transaction: Transaction): Promise<CorteCoracao[]> {
    if (!dataList.length) return [];

    const existing = await this.model.findAll({
      where: {
        [Op.or]: dataList.map(d => ({
          idarea: d.idarea,
          idfita: d.idfita,
          semana: d.semanacorte,
          ano: d.anocorte
        }))
      },
      transaction
    });

    return existing.map(r => r.dataValues as CorteCoracao);
  }
}
