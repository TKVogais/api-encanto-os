import { Transaction } from "sequelize";
import { CreateCorteCoracaoDto, ResCreateCorteCoracaoDto, ResUpdateCorteCoracaoDto } from "../DTOs/cortecoracao";
import { CorteCoracao } from "../entities/cortecoracao";
import { ICorteCoracoesRepository, ICorteCoracoesService } from "../interfaces/cortecoracao";
import { IParamsAnuaisService } from "../interfaces/params";
import { IPrevisaoColheitaService } from "../interfaces/previsaocolheita";
import { IResumoPrevisaoService } from "../interfaces/resumoprevisao";
import sequelize from "../sequelize/config/config";
import moment from "moment";
import { CreateInventarioCachosDto, UpdateInventarioCachosDto } from "../DTOs/inventariocachos";
import { IInventarioCachosService } from "../interfaces/inventariocachos";

export class CorteCoracoesService implements ICorteCoracoesService {
  static readonly ERROR_REPO = "É necessário fornecer um repository.";

  constructor(
    private repository: ICorteCoracoesRepository,
    private servicePrevisao: IPrevisaoColheitaService,
    private serviceResumo: IResumoPrevisaoService,
    private serviceParams: IParamsAnuaisService,
    private serviceInventario: IInventarioCachosService
  ) {
    if (!repository) throw new Error(CorteCoracoesService.ERROR_REPO);
  }

  async bulkCreate(dataList: CreateCorteCoracaoDto[]): Promise<ResCreateCorteCoracaoDto> {
    console.log("Break Point 1 - Início do bulkCreate");
    const transaction = await sequelize.transaction();
    let isTransactionFinished = false; // flag manual

    try {
      // 0️⃣ Verificar anos
      console.log("Break Point 2 - Verificando anos");
      const anos = Array.from(new Set(dataList.map(d => d.anocorte)));
      if (anos.length > 1) {
        console.log("Break Point 3 - Mais de um ano detectado");
        return {
          status: 400,
          message: `Erro: só é permitido processar um ano por vez. Anos encontrados: ${anos.join(", ")}`,
        };
      }

      const anoCorte = anos[0];
      console.log("Break Point 4 - Ano definido:", anoCorte);

      // 1️⃣ Filtrar duplicados
      console.log("Break Point 5 - Filtrando duplicados");
      const validData = await this._filterDuplicados(dataList, transaction);
      if (validData.length === 0) {
        console.log("Break Point 6 - Todos os cortes já cadastrados");
        await transaction.rollback();
        isTransactionFinished = true;
        return { status: 200, message: "Todos os cortes já estão cadastrados!" };
      }
      console.log("Break Point 7 - Dados válidos encontrados:", validData.length);

      // 2️⃣ Buscar parâmetros do ano específico
      console.log("Break Point 8 - Buscando parâmetros do ano");
      const foundParams = await this._getParametros(anoCorte, transaction);
      if (!foundParams) throw new Error(`Parâmetros do ano ${anoCorte} não encontrados`);
      console.log("Break Point 9 - Parâmetros encontrados");

      // 3️⃣ Criar cortes em massa
      console.log("Break Point 10 - Criando cortes em massa");
      const cortes = await this._bulkCreateCortes(validData, transaction);
      console.log("Break Point 11 - Cortes criados:", cortes.length);

      // 3.1️⃣ Inventário
      console.log("Break Point 12 - Buscando inventário existente");
      const inventarioExistente = await this.serviceInventario.findAllByAreasEFitas(validData, transaction);
      console.log("Break Point 13 - Inventário existente:", inventarioExistente.length);

      const novosInventarios: CreateInventarioCachosDto[] = [];
      const inventariosAtualizar: UpdateInventarioCachosDto[] = [];

      for (const item of validData) {
        const existente = inventarioExistente.find(
          inv => inv.idarea === item.idarea && inv.idfita === item.idfita
        );

        if (existente) {
          inventariosAtualizar.push({
            idinventario: existente.idinventario,
            idarea: existente.idarea,
            idfita: existente.idfita,
            colhidos: existente.colhidos + Number(item.coracoes),
            total: existente.total + Number(item.coracoes),
            ajustes: existente.ajustes,
            coracoes: existente.coracoes,
          });
        } else {
          novosInventarios.push({
            idarea: item.idarea,
            idfita: item.idfita,
            coracoes: Number(item.coracoes),
            colhidos: Number(item.coracoes),
            ajustes: 0,
            total: Number(item.coracoes),
          });
        }
      }
      console.log("Break Point 14 - Novos inventários:", novosInventarios.length, "Atualizações:", inventariosAtualizar.length);

      if (novosInventarios.length > 0) {
        console.log("Break Point 15 - Criando novos inventários");
        await this.serviceInventario.bulkCreate(novosInventarios as any, transaction);
      }
      if (inventariosAtualizar.length > 0) {
        console.log("Break Point 16 - Atualizando inventários existentes");
        await this.serviceInventario.bulkUpdate(inventariosAtualizar, transaction);
      }

      // 4️⃣ Criar previsões
      console.log("Break Point 17 - Criando previsões");
      await this._bulkCreatePrevisoes(cortes, validData, transaction);

      // 5️⃣ Agrupar resumos
      console.log("Break Point 18 - Agrupando resumos");
      const resumoMap = new Map<string, { coracoes: number; previsao: number; exampleData: CreateCorteCoracaoDto }>();
      for (const d of validData) {
        const key = `${d.semanacorte}-${d.semanaprevisao}-${d.anocorte}-${d.anoprevisao}`;
        if (!resumoMap.has(key)) {
          resumoMap.set(key, { coracoes: Number(d.coracoes), previsao: Number(d.previsao), exampleData: d });
        } else {
          const entry = resumoMap.get(key)!;
          entry.coracoes += Number(d.coracoes);
          entry.previsao += Number(d.previsao);
        }
      }

      for (const { coracoes, previsao, exampleData } of resumoMap.values()) {
        console.log("Break Point 19 - Upsert resumo:", exampleData.idarea, exampleData.semanacorte);
        await this._upsertResumo({ ...exampleData, coracoes, previsao }, transaction);
      }

      // 6️⃣ Atualizar parâmetros globais
      console.log("Break Point 20 - Atualizando parâmetros globais");
      const totalCoracoes = validData.reduce((sum, d) => sum + Number(d.coracoes), 0);
      const totalPrevisao = validData.reduce((sum, d) => sum + Number(d.previsao), 0);
      await this._updateParametrosBulk(foundParams, { totalCoracoes, totalPrevisao }, transaction);

      // 7️⃣ Commit
      console.log("Break Point 21 - Commit da transação");
      await transaction.commit();
      isTransactionFinished = true;

      console.log("Break Point 22 - Sucesso total");
      return { status: 200, message: "Cortes e inventário processados com sucesso!" };

    } catch (error: any) {
      console.error("Break Point ERROR:", error);

      if (!isTransactionFinished) {
        console.log("Break Point 23 - Rollback da transação");
        await transaction.rollback();
      }

      return { status: 500, message: error.message || "Falha ao cadastrar cortes de corações!" };
    }
  }


  async list(): Promise<CorteCoracao[]> {
    return this.repository.list();
  }

  async update(data: CreateCorteCoracaoDto): Promise<ResUpdateCorteCoracaoDto> {
    const transaction = await sequelize.transaction()
    try {
      const { idarea, idfita, idcortecoracao } = data
      const datacorte = {
        datacorte: data.datacorte,
        idarea,
        idfita,
        coracoes: data.coracoes,
        semana: data.semanacorte,
        ano: data.anocorte
      }
      // 2️⃣ Cria o corte
      const corte = await this.repository.update(idcortecoracao, datacorte, transaction)

      if (!corte) throw new Error("Falha ao cadastrar o corte de coração")

      // 3️⃣ Cria a previsão associada
      const prev = {
        idcortecoracao: idcortecoracao,
        idarea,
        idfita,
        previsao: data.previsao,
        semana: data.semanaprevisao,
        ano: data.anoprevisao,
        idprevisao: data.idcortecoracao
      }

      const createPrev = await this.servicePrevisao.update(prev, transaction)
      if (createPrev.status !== 200) throw new Error("Falha ao cadastrar a previsão")

      // 4️⃣ Commit da transação
      await transaction.commit()

      return {
        status: 200, message: "Corte de corações cadastrado com sucesso!", cortecoracao: {
          idcortecoracao: data.idcortecoracao,
          datacorte: data.datacorte,
          idarea: data.idarea,
          idfita: data.idfita,
          coracoes: data.coracoes,
          semana: data.semanacorte,
          ano: data.anocorte
        }
      }
    } catch (error) {
      console.error(error)
      await transaction.rollback()
      return { status: 500, message: "Falha ao cadastrar corte de corações!" }
    }
  }

  private async _bulkCreateCortes(dataList: CreateCorteCoracaoDto[], transaction: Transaction) {
    const cortes = await this.repository.bulkCreate(
      dataList.map(d => ({
        datacorte: d.datacorte,
        idarea: d.idarea,
        idfita: d.idfita,
        coracoes: d.coracoes,
        semana: d.semanacorte,
        ano: d.anocorte
      })),
      transaction
    );
    return cortes;
  }


  private async _bulkCreatePrevisoes(cortes: any[], dataList: CreateCorteCoracaoDto[], transaction: Transaction) {
    const previsoes = cortes.map((c, i) => ({
      idcortecoracao: c.idcortecoracao,
      idarea: dataList[i].idarea,
      idfita: dataList[i].idfita,
      previsao: dataList[i].previsao,
      semana: dataList[i].semanaprevisao,
      ano: dataList[i].anoprevisao
    }));

    await this.servicePrevisao.bulkCreate(previsoes, transaction);
    return true;
  }

  private async _updateParametrosBulk(
    foundParams: any,
    totals: { totalCoracoes: number; totalPrevisao: number },
    transaction: Transaction
  ) {
    const { totalCoracoes, totalPrevisao } = totals;

    const prevParams = {
      ...foundParams,
      coracoescorte: Number(foundParams.coracoescorte) + totalCoracoes,
      previsto: Number(foundParams.previsto) + totalPrevisao / 1000,
      percenmeta: Number(foundParams.colhido) * 100 / (Number(foundParams.previsto) + totalPrevisao)
    };

    await this.serviceParams.update(prevParams, transaction);
  }

  private async _upsertResumo(data: CreateCorteCoracaoDto & { coracoes: number; previsao: number }, transaction: Transaction) {
    const dataresume = {
      semanacorte: Number(data.semanacorte),
      semanaprev: Number(data.semanaprevisao),
      anocorte: Number(data.anocorte),
      anoprev: Number(data.anoprevisao)
    };

    const foundResume = await this.serviceResumo.findByParms(dataresume, transaction);

    if (!foundResume) {
      await this.serviceResumo.create({
        coracoes: data.coracoes,
        previsao: data.previsao,
        semanaprev: data.semanaprevisao,
        mes: this._getMonth(data.datacorte),
        anoprev: data.anoprevisao,
        semanacorte: data.semanacorte,
        anocorte: data.anocorte,
        idfita: data.idfita
      }, transaction);
    } else {
      await this.serviceResumo.update({
        ...foundResume,
        coracoes: Number(foundResume.coracoes) + Number(data.coracoes),
        previsao: Number(foundResume.previsao) + Number(data.previsao)
      }, transaction);
    }

    return true;
  }

  private async _filterDuplicados(dataList: CreateCorteCoracaoDto[], transaction: Transaction) {
    const existing = await this.repository.findDuplicates(dataList, transaction);

    const existingKeys = new Set(
      existing.map(e => `${e.idarea}-${e.idfita}-${e.semana}-${e.ano}`)
    );

    return dataList.filter(d =>
      !existingKeys.has(`${d.idarea}-${d.idfita}-${d.semanacorte}-${d.anocorte}`)
    );
  }

  private async _getParametros(ano: number, transaction: Transaction) {

    const foundParams = await this.serviceParams.findByYear(ano);

    if (!foundParams) throw new Error(`Parâmetro de ${ano} indefinido!`);
    return foundParams;
  }

  private _getMonth(datacorte: Date): number {
    const previsao = [
      { mes: 1, previsao: 77 },
      { mes: 2, previsao: 84 },
      { mes: 3, previsao: 91 },
      { mes: 4, previsao: 91 },
      { mes: 5, previsao: 91 },
      { mes: 6, previsao: 91 },
      { mes: 7, previsao: 91 },
      { mes: 8, previsao: 84 },
      { mes: 9, previsao: 84 },
      { mes: 10, previsao: 77 },
      { mes: 11, previsao: 77 },
      { mes: 12, previsao: 77 },
    ];

    const data = moment(datacorte);
    const mesCorte = data.month() + 1; // mês original

    const diasPrev = previsao.find(p => p.mes === mesCorte)?.previsao ?? 0;

    // Data após adicionar dias previstos
    const dataPrevista = data.clone().add(diasPrev, "days");

    // Verifica se a semana pertence ao próximo ano
    const anoSemana = dataPrevista.isoWeekYear();
    const anoData = dataPrevista.year();

    let mesPrev = dataPrevista.month() + 1;

    if (anoSemana > anoData) {
      // Se a semana pertence ao próximo ano, ajusta o mês para janeiro
      mesPrev = 1;
    }

    return mesPrev;
  }

}