import { Model, ModelStatic, Sequelize, Transaction } from "sequelize";
import { IPrevisaoColheitaRepository } from "../interfaces/previsaocolheita";
import { PrevisaoColheita } from "../entities/precisaocolheita";
import moment from "moment";
import sequelize from "../sequelize/config/config";
import { Op } from "sequelize";

export class PrevisaoColheitaRepository implements IPrevisaoColheitaRepository {
  private modelPrevisao: ModelStatic<Model<any, any>>;
  private modelArea: ModelStatic<Model<any, any>>;
  private modelFita: ModelStatic<Model<any, any>>;
  private modelCorte: ModelStatic<Model<any, any>>;

  constructor(
    modelPrevisao: ModelStatic<Model<any, any>>,
    modelArea: ModelStatic<Model<any, any>>,
    modelFita: ModelStatic<Model<any, any>>,
    modelCorte: ModelStatic<Model<any, any>>
  ) {
    this.modelPrevisao = modelPrevisao;
    this.modelArea = modelArea
    this.modelFita = modelFita
    this.modelCorte = modelCorte
  }

  async create(previsao: Partial<PrevisaoColheita>, transaction: Transaction): Promise<PrevisaoColheita> {
    const { dataValues } = await this.modelPrevisao.create(previsao as any, { transaction });
    return dataValues as PrevisaoColheita;
  }

  async list(): Promise<PrevisaoColheita[]> {
    const hoje = moment();

    // Primeiro dia do mês atual
    const inicioMes = hoje.clone().startOf("month"); // 01/10/2025
    const semanaInicio = inicioMes.isoWeek();
    const anoInicio = inicioMes.year();

    // Último dia do mês 12 meses à frente
    const fimMes = inicioMes.clone().add(12, "months").endOf("month");
    const semanaFim = fimMes.isoWeek();
    const anoFim = fimMes.year();

    // Transformamos ano e semana em número para facilitar a comparação
    const startKey = anoInicio * 100 + semanaInicio; // ex: 2025*100 + 40 = 202540
    const endKey = anoFim * 100 + semanaFim;

    const records = await this.modelPrevisao.findAll({
      attributes: ["idprevisao", "previsao", "semana", "ano"],
      include: [
        {
          as: "area",
          model: this.modelArea,
          attributes: ["area"],
        },
        {
          as: "fita",
          model: this.modelFita,
          attributes: ["fita", "hex"],
        },
      ],
      where: sequelize.where(
        Sequelize.literal("ano * 100 + semana"),
        {
          [Op.between]: [startKey, endKey],
        }
      ),
      order: [["ano", "ASC"], ["semana", "ASC"]],
    });

    return records.map((r) => r.dataValues as PrevisaoColheita);
  }

  async update(idcortecoracao: number, previsao: Partial<PrevisaoColheita>): Promise<boolean> {
    const [affectedCount] = await this.modelPrevisao.update(previsao, { where: { idcortecoracao } });
    return affectedCount > 0;
  }

  async findByPk(idprevisao: number): Promise<PrevisaoColheita | null> {
    const record = await this.modelPrevisao.findOne({ where: { idprevisao }, include: ["cortecoracao", "area", "fita"] });
    return record?.dataValues as PrevisaoColheita || null;
  }
  async bulkCreate(dataList: PrevisaoColheita[], transaction: Transaction): Promise<PrevisaoColheita[]> {
    const records = await this.modelPrevisao.bulkCreate(dataList as any[], { transaction });
    return records.map(r => r.dataValues as PrevisaoColheita);
  }

}
