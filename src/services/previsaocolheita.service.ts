import { Transaction } from "sequelize";
import { CreatePrevisaoColheitaDto, ResCreatePrevisaoColheitaDto, ResUpdatePrevisaoColheitaDto } from "../DTOs/previsaocolheita";
import { PrevisaoColheita } from "../entities/precisaocolheita";
import { IPrevisaoColheitaRepository, IPrevisaoColheitaService } from "../interfaces/previsaocolheita";
import { IParamsAnuaisService } from "../interfaces/params";
import { IResumoColheitaService } from "../interfaces/resumocolheita";
import { IResumoPrevisaoService } from "../interfaces/resumoprevisao";

export class PrevisaoColheitaService implements IPrevisaoColheitaService {
  static readonly ERROR_REPO = "É necessário fornecer um repository.";

  constructor(
    private repository: IPrevisaoColheitaRepository,
    private serviceParams: IParamsAnuaisService,
    private serviceResumoColheita: IResumoColheitaService,
    private serviceResumoPrevisao: IResumoPrevisaoService
  ) {
    if (!repository) throw new Error(PrevisaoColheitaService.ERROR_REPO);
  }

  async create(previsao: CreatePrevisaoColheitaDto, transaction: Transaction): Promise<ResCreatePrevisaoColheitaDto> {
    try {
      const response = await this.repository.create(previsao, transaction);
      return { status: 200, message: "Previsão de colheita criada com sucesso!", previsaoColheita: response };
    } catch (error: any) {
      console.log(error);
      return { status: 500, message: "Falha ao criar a previsão de colheita!" };
    }
  }

  async list(): Promise<PrevisaoColheita[]> {
    return this.repository.list();
  }

  async update(previsao: PrevisaoColheita, transaction: Transaction): Promise<ResUpdatePrevisaoColheitaDto> {
    try {
      const { idcortecoracao, ...rest } = previsao;
      const updated = await this.repository.update(idcortecoracao, rest, transaction);
      if (updated) return { status: 200, message: "Previsão de colheita atualizada com sucesso!", previsaoColheita: previsao };
      return { status: 400, message: "A previsão de colheita não foi atualizada", previsaoColheita: null };
    } catch (error: any) {
      console.log(error);
      return { status: 500, message: "Falha ao atualizar a previsão de colheita!" };
    }
  }

  async findPrevisao(): Promise<any> {
    const ano = new Date().getFullYear()

    const [params, previsao, colhidos, previsto, realizado, coracoes] = await Promise.all([
      this.serviceParams.findByYear(ano),
      this.serviceResumoPrevisao.list(),
      this.serviceResumoColheita.listByYear(ano),
      this.serviceResumoPrevisao.listByBetweenYearMonth(),
      this.serviceResumoColheita.listByBetweenYearMonth(),
      this.serviceResumoPrevisao.listResumoCoracoes()
    ])

    return {
      params,
      previsao,
      colhidos,
      previsto,
      realizado,
      coracoes
    }
  }
  async bulkCreate(dataList: CreatePrevisaoColheitaDto[], transaction: Transaction): Promise<ResCreatePrevisaoColheitaDto> {
    if (!dataList.length)
      return { status: 200, message: "Nenhuma previsão a cadastrar." };

    const previsoes = await this.repository.bulkCreate(
      dataList.map(d => ({
        idcortecoracao: d.idcortecoracao,
        idarea: d.idarea,
        idfita: d.idfita,
        previsao: d.previsao,
        semana: d.semana,
        ano: d.ano
      })),
      transaction
    );

    return {
      status: 200,
      message: `${previsoes.length} previsões cadastradas com sucesso!`,
    };
  }
}
