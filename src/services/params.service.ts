import { Transaction } from "sequelize";
import { CreateParamsAnuaisDto, ResCreateParamsAnuaisDto, ResUpdateParamsAnuaisDto } from "../DTOs/params";
import { ResUpdateResumoPrevisaoDto } from "../DTOs/resumoprevisao";
import { ParamsAnuais } from "../entities/params";
import { IParamsAnuaisRepository, IParamsAnuaisService } from "../interfaces/params";

export class ParamsAnuaisService implements IParamsAnuaisService {
  static readonly ERROR_REPO = "É necessário fornecer um repository.";

  constructor(private repository: IParamsAnuaisRepository) {
    if (!repository) throw new Error(ParamsAnuaisService.ERROR_REPO);
  }
  async findByYear(year: number): Promise<ParamsAnuais> {

    const response = await this.repository.findByYear(year)

    return response
      ? response
      : {
        idparam: 0,
        ano: 0,
        previsto: 0,
        colhido: 0,
        meta: 0,
        percenmeta: 0,
        mediacacho: 0,
        coracoescorte: 0,
        cachoscolhidos: 0
      }

  }

  async create(data: CreateParamsAnuaisDto): Promise<ResCreateParamsAnuaisDto> {
    try {
      const response = await this.repository.create(data);
      return {
        status: 200,
        message: "Parâmetro anual cadastrado com sucesso!",
        param: response,
      };
    } catch (error: any) {
      console.log(error);
      return { status: 500, message: "Falha ao cadastrar o parâmetro anual!" };
    }
  }

  list(): Promise<ParamsAnuais[]> {
    return this.repository.list();
  }

  async update(data: ParamsAnuais, transaction: Transaction): Promise<ResUpdateParamsAnuaisDto> {
    try {
      const { idparam, ...rest } = data;
      const updated = await this.repository.update(idparam, rest, transaction);
      if (updated) {
        return {
          status: 200,
          message: "Parâmetro anual atualizado com sucesso!",
          param: data,
        };
      }
      return {
        status: 400,
        message: "O parâmetro anual não foi atualizado",
        param: null,
      };
    } catch (error: any) {
      console.log(error);
      return {
        status: 500,
        message: "Falha ao atualizar o parâmetro anual!",
      };
    }
  }
}
