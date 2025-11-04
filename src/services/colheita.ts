import { ColheitasHectares, CreateColheitaDto, MediaColheita, ResCreateColheitaDto, ResUpdateColheitaDto } from "../DTOs/colheita";
import { Colheita } from "../entities/colheita";
import { IColheitaRepository, IColheitaService } from "../interfaces/colheita";
import { IResumoColheitaService } from "../interfaces/resumocolheita";
import sequelize from "../sequelize/config/config";
import { IParamsAnuaisService } from "../interfaces/params";
import { Transaction } from "sequelize";

export class ColheitasService implements IColheitaService {
  static readonly ERROR_REPO = "É necessário fornecer um repository.";

  constructor(
    private repository: IColheitaRepository,
    private serviceResumoColheita: IResumoColheitaService,
    private serviceParams: IParamsAnuaisService

  ) {
    if (!repository) throw new Error(ColheitasService.ERROR_REPO);
  }
  async findMediasColheitasAreas(): Promise<MediaColheita[]> {
    const ano = new Date().getFullYear()
    return await this.repository.findMediasColheitasAreas(ano)
  }
  async findColheitasHectares(): Promise<ColheitasHectares[]> {
    const ano = new Date().getFullYear()

    return await this.repository.findColheitasHectares(ano)
  }

  async findByParams(idarea: number, data: Date): Promise<Colheita | null> {
    return await this.repository.findByParams(idarea, data)
  }

  async bulkCreate(dataList: CreateColheitaDto[]): Promise<ResCreateColheitaDto> {
    try {
      // 0️⃣ Verificar anos presentes
      const anos = Array.from(new Set(dataList.map(d => d.ano)));
      if (anos.length > 1) {
        return {
          status: 400,
          message: `Erro: só é permitido processar um ano por vez. Anos encontrados: ${anos.join(", ")}`
        };
      }

      // Como só existe um ano, usamos ele para buscar parâmetros
      const anoColheita = anos[0];

      const transaction = await sequelize.transaction();
      try {
        // 1️⃣ Filtra duplicados usando findDuplicates
        const validData = await this._filterDuplicados(dataList, transaction);
        if (!validData.length) {
          await transaction.rollback();
          return { status: 200, message: "Todas as colheitas já estão cadastradas!" };
        }

        // 2️⃣ Busca parâmetros do ano específico
        const foundParams = await this.serviceParams.findByYear(anoColheita);
        if (!foundParams) throw new Error(`Parâmetros do ano ${anoColheita} não encontrados!`);

        // 3️⃣ Inserção em massa
        await this.repository.bulkCreate(validData, transaction);

        // 4️⃣ Atualiza resumos
        for (const data of validData) {
          await this._upsertResumoColheita(data, transaction);
        }

        // 5️⃣ Atualiza parâmetros anuais globais
        await this._updateParametrosBulk(foundParams, validData, transaction);

        // 6️⃣ Commit da transação
        await transaction.commit();
        return { status: 200, message: "Colheitas cadastradas com sucesso!" };
      } catch (error: any) {
        await transaction.rollback();
        console.error(error);
        return { status: 500, message: error.message || "Falha ao cadastrar colheitas!" };
      }
    } catch (error: any) {
      console.error(error);
      return { status: 500, message: error.message || "Erro inesperado!" };
    }
  }


  /** 🔍 Remove duplicadas antes do insert */
  private async _filterDuplicados(dataList: CreateColheitaDto[], transaction: Transaction) {
    const existing = await this.repository.findDuplicates(dataList, transaction);

    const existingKeys = new Set(
      existing.map(e => `${e.idarea}-${e.semana}-${e.ano}`)
    );

    return dataList.filter(d =>
      !existingKeys.has(`${d.idarea}-${d.semana}-${d.ano}`)
    );
  }

  /** 📊 Atualiza ou cria resumo de colheita */
  private async _upsertResumoColheita(data: CreateColheitaDto, transaction: Transaction) {
    const params = { ano: data.ano, mes: data.mes, idarea: data.idarea };
    const foundResume = await this.serviceResumoColheita.findByParams(params, transaction);

    if (!foundResume) {
      await this.serviceResumoColheita.create({
        mes: data.mes,
        ano: data.ano,
        cachos: data.cachos,
        kgcolhidos: data.kgcolhidos,
        media: data.kgcolhidos / data.cachos,
        idarea: data.idarea,
      }, transaction);
    } else {
      const newCachos = Number(foundResume.cachos) + Number(data.cachos);
      const newKg = Number(foundResume.kgcolhidos) + Number(data.kgcolhidos);

      await this.serviceResumoColheita.update({
        ...foundResume,
        cachos: newCachos,
        kgcolhidos: newKg,
        media: newKg / newCachos,
      }, transaction);
    }
  }

  /** 📈 Atualiza parâmetros anuais globais */
  private async _updateParametrosBulk(foundParams: any, dataList: CreateColheitaDto[], transaction: Transaction) {
    const totalCachos = dataList.reduce((acc, d) => acc + Number(d.cachos), 0);
    const totalKg = dataList.reduce((acc, d) => acc + Number(d.kgcolhidos), 0) / 1000;

    const updated = {
      ...foundParams,
      colhido: Number(foundParams.colhido) + totalKg,
      cachoscolhidos: Number(foundParams.cachoscolhidos) + totalCachos,
    };

    updated.percenmeta = (updated.colhido * 100) / foundParams.previsto;
    updated.mediacacho = (updated.colhido / updated.cachoscolhidos) * 1000;

    await this.serviceParams.update(updated, transaction);
  }

  async create(colheita: CreateColheitaDto): Promise<ResCreateColheitaDto> {
    const transaction = await sequelize.transaction()
    try {
      const { idarea, data } = colheita
      const foundColheita = await this.findByParams(idarea, data)

      if (foundColheita) {
        await transaction.rollback()
        return { status: 200, message: "Colheita já cadastrada!", colheita: null }
      }
      const dataResume = { ano: colheita.ano, mes: colheita.mes, idarea: colheita.idarea }
      const foundResume = await this.serviceResumoColheita.findByParams(dataResume, transaction)

      const anoparametro = new Date().getFullYear()
      const foundParams = await this.serviceParams.findByYear(anoparametro)

      if (!foundParams) throw new Error(`Parâmetro de dados de ${anoparametro} indefinido!`)

      const response = await this.repository.create(colheita, transaction);

      if (!foundResume) {
        console.log("Criação do Resumo")
        await this.serviceResumoColheita.create({
          mes: colheita.mes,
          ano: colheita.ano,
          cachos: colheita.cachos,
          kgcolhidos: colheita.kgcolhidos,
          media: colheita.kgcolhidos / colheita.cachos,
          idarea: colheita.idarea
        }, transaction)
      } else {
        console.log("Criação do Resumo")
        console.log("Valores Prévios:")
        console.log(foundResume)
        console.log("Valores Atualizados: ")
        const prevCachos = Number(foundResume.cachos) + Number(colheita.cachos)
        const prevKG = Number(foundResume.kgcolhidos) + Number(colheita.kgcolhidos)
        const update = await this.serviceResumoColheita.update({
          ...foundResume,
          cachos: prevCachos,
          kgcolhidos: prevKG,
          media: prevKG / prevCachos

        }, transaction)
      }

      console.log("==============================")
      console.log(foundResume)
      console.log("==============================")
      console.log(colheita)
      console.log("==============================")

      const cachoscolhidos = (Number(foundParams.cachoscolhidos) + Number(colheita.cachos))
      const kgcolhidos = (Number(foundParams.colhido) + Number(colheita.kgcolhidos)) / 1000

      const prevParams = {
        ...foundParams,
        colhido: kgcolhidos,
        percenmeta: kgcolhidos * 100 / foundParams.previsto,
        cachoscolhidos: cachoscolhidos,
        mediacacho: (kgcolhidos / cachoscolhidos) * 1000
      }

      console.log(prevParams)
      console.log("==============================")

      await this.serviceParams.update(prevParams, transaction)

      // 4️⃣ Commit da transação
      await transaction.commit()

      return {
        status: 200,
        message: "Colheita cadastrada com sucesso!",
        colheita: response,
      };
    } catch (error: any) {
      console.log(error);
      await transaction.rollback()
      return { status: 500, message: "Falha ao cadastrar a colheita!" };
    }
  }

  list(): Promise<Colheita[]> {
    return this.repository.list();
  }

  async update(colheita: Colheita): Promise<ResUpdateColheitaDto> {
    const transaction = await sequelize.transaction()
    try {
      const { idcolheita, ...left } = colheita;
      const updated = await this.repository.update(idcolheita, left, transaction);
      if (updated) {
        return {
          status: 200,
          message: "Colheita atualizada com sucesso!",
          colheita,
        };
      }
      await transaction.commit()
      return {
        status: 400,
        message: "A colheita não foi atualizada",
        colheita: null,
      };
    } catch (error: any) {
      await transaction.rollback()
      console.log(error);
      return { status: 500, message: "Falha ao atualizar a colheita!" };
    }
  }
}
