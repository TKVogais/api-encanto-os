import { Transaction } from "sequelize";
import { CreateResumoColheitaDto, FindByParamsDto, ResCreateResumoColheitaDto, ResUpdateResumoColheitaDto } from "../DTOs/resumocolheita";
import { ResumoColheita } from "../entities/resumocolheita";
import { IResumoColheitaRepository, IResumoColheitaService } from "../interfaces/resumocolheita";
import moment from "moment";
import { GenBetweenPrevParams } from "../util/gen-data-between-prev";

export class ResumoColheitaService implements IResumoColheitaService {
  static readonly ERROR_REPO = "É necessário fornecer um repository.";

  constructor(private repository: IResumoColheitaRepository) {
    if (!repository) throw new Error(ResumoColheitaService.ERROR_REPO);
  }
  async listByYear(ano: number): Promise<ResumoColheita[]> {
    return this.repository.listByYear(ano);
  }
  async findByParams(params: FindByParamsDto, transaction: Transaction): Promise<ResumoColheita | null> {
    return this.repository.findByParams(params, transaction)
  }

  async create(dto: CreateResumoColheitaDto, transaction: Transaction): Promise<ResCreateResumoColheitaDto> {
    try {
      const response = await this.repository.create({
        mes: dto.mes,
        ano: dto.ano,
        cachos: dto.cachos,
        kgcolhidos: dto.kgcolhidos,
        media: dto.media,
        idarea: dto.idarea
      }, transaction);
      return { status: 200, message: "Resumo criado com sucesso!", resumo: response };
    } catch (error) {
      console.log(error);
      return { status: 500, message: "Erro ao criar resumo!" };
    }
  }

  list(): Promise<ResumoColheita[]> {
    return this.repository.list();
  }

  async listByBetweenYearMonth(): Promise<ResumoColheita[]> {
    const {mesInicial, mesFinal, anoInicial, anoFinal } = GenBetweenPrevParams(true)
    return this.repository.listByBetweenYearMonth(mesInicial, mesFinal, anoInicial, anoFinal)
  }

  async update(dto: ResumoColheita, transaction: Transaction): Promise<ResUpdateResumoColheitaDto> {
    try {
      const { idresumo, ...left } = dto;
      const updated = await this.repository.update(idresumo, left, transaction);
      if (updated) {
        return { status: 200, message: "Resumo atualizado com sucesso!", resumo: dto };
      }
      return { status: 400, message: "Resumo não atualizado!", resumo: null };
    } catch (error: any) {
      console.error(error);
      return { status: 500, message: "Erro ao atualizar resumo!" };
    }
  }
}
