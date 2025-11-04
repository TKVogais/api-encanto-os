import { Transaction } from "sequelize";
import { CreateResumoPrevisaoDto, FindByParamsDto, ResCreateResumoPrevisaoDto, ResUpdateResumoPrevisaoDto } from "../DTOs/resumoprevisao";
import { ResumoPrevisao } from "../entities/resumoprevisao";
import { IResumoPrevisaoRepository, IResumoPrevisaoService } from "../interfaces/resumoprevisao";
import { GenBetweenPrevParams } from "../util/gen-data-between-prev";
import { CorteCoracao } from "../entities/cortecoracao";

export class ResumoPrevisaoService implements IResumoPrevisaoService {
  constructor(private repository: IResumoPrevisaoRepository) {
    if (!repository) throw new Error("Repository é obrigatório.");
  }
  async listResumoCoracoes(): Promise<CorteCoracao[]> {
    return await this.repository.listResumoCoracoes()
  }
  findPrevisao(): Promise<any> {
    throw new Error("Method not implemented.");
  }

  findByParms(params: FindByParamsDto, transaction: Transaction): Promise<ResumoPrevisao | null> {
    return this.repository.findByParms(params, transaction)
  }

  async create(dto: CreateResumoPrevisaoDto, transaction: Transaction): Promise<ResCreateResumoPrevisaoDto> {
    try {
      const response = await this.repository.create({
        coracoes: dto.coracoes,
        previsao: dto.previsao,
        semanaprev: dto.semanaprev,
        mes: dto.mes,
        anoprev: dto.anoprev,
        anocorte: dto.anocorte,
        semanacorte: dto.semanacorte,
        idfita: dto.idfita
      }, transaction);
      return { status: 200, message: "Resumo criado com sucesso!", resumo: response };
    } catch (error) {
      console.log(error);
      return { status: 500, message: "Erro ao criar resumo!" };
    }
  }

  async list(): Promise<ResumoPrevisao[]> {
    return this.repository.list();
  }

  async update(resumo: ResumoPrevisao, transaction: Transaction): Promise<ResUpdateResumoPrevisaoDto> {
    try {
      const { idresumo, ...left } = resumo;
      const updated = await this.repository.update(idresumo, left, transaction);
      if (updated) return { status: 200, message: "Resumo atualizado com sucesso!", resumo };
      return { status: 400, message: "Resumo não atualizado", resumo: null };
    } catch (error) {
      console.log(error);
      return { status: 500, message: "Erro ao atualizar resumo!" };
    }
  }
  async listByBetweenYearMonth(): Promise<ResumoPrevisao[]> {
    const { mesInicial, mesFinal, anoInicial, anoFinal } = GenBetweenPrevParams()
    return this.repository.listByBetweenYearMonth(mesInicial, mesFinal, anoInicial, anoFinal)
  }
}
