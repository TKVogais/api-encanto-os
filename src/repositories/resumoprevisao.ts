import { Model, ModelStatic, QueryTypes, Transaction } from "sequelize";
import { IResumoPrevisaoRepository } from "../interfaces/resumoprevisao";
import { CreateResumoPrevisaoDto, FindByParamsDto } from "../DTOs/resumoprevisao";
import { ResumoPrevisao } from "../entities/resumoprevisao";
import sequelize from "../sequelize/config/config";
import { Op } from "sequelize";
import { GenBetweenWeekParams } from "../util/gen-week-between-prev";
import { CorteCoracao } from "../entities/cortecoracao";

export class ResumoPrevisaoRepository implements IResumoPrevisaoRepository {
    constructor(
        private model: ModelStatic<Model<any, any>>,
        private modelCorteCoracao: ModelStatic<Model<any, any>>) {
        if (!model) throw new Error("Model do resumo é obrigatória.");
    }
    async listResumoCoracoes(): Promise<CorteCoracao[]> {
        const { semanaInicial, semanaFinal, anoInicial, anoFinal } = GenBetweenWeekParams("corte");
        const anoInicialI = anoInicial
        const anoFinalI = anoInicial
        const sql = `
    SELECT DISTINCT 
    a.area, 
    c.coracoes, 
    rp.semanacorte, 
    rp.semanaprev,
    f.hex 
FROM resumoprevisao AS rp
	INNER JOIN cortecoracoes as c on c.semana = rp.semanacorte
    INNER JOIN areas as a on a.idarea = c.idarea
	INNER JOIN fitas as f on f.idfita = rp.idfita
WHERE 
  (anoprev = :anoInicial AND semanaprev >= :semanaInicial and c.ano = :anoInicialI)
  OR
  (anoprev = :anoFinal AND semanaprev <= :semanaFinal AND c.ano = :anoFinalI);`;

        const resultados = await sequelize.query(sql, {
            replacements: { anoInicial, semanaInicial, anoInicialI, anoFinal, semanaFinal, anoFinalI },
            type: QueryTypes.SELECT,
        });

        return resultados as CorteCoracao[];
    }

    async findByParms(params: FindByParamsDto, transaction: Transaction): Promise<ResumoPrevisao | null> {
        const record = await this.model.findOne({
            where: { ...params },
            transaction
        });
        return record?.dataValues as ResumoPrevisao || null;
    }

    async create(dto: CreateResumoPrevisaoDto): Promise<ResumoPrevisao> {
        const { dataValues } = await this.model.create({
            coracoes: dto.coracoes,
            previsao: dto.previsao,
            semanaprev: dto.semanaprev,
            anoprev: dto.anoprev,
            semanacorte: dto.semanacorte,
            anocorte: dto.anocorte,
            mes: dto.mes,
            idfita: dto.idfita
        });
        return dataValues as ResumoPrevisao;
    }

    async list(): Promise<ResumoPrevisao[]> {
        const { semanaInicial, semanaFinal, anoInicial, anoFinal } = GenBetweenWeekParams();

        // Cria chave combinada ano * 100 + semana
        const startKey = anoInicial * 100 + semanaInicial;
        const endKey = anoFinal * 100 + semanaFinal;

        const records = await this.model.findAll({
            include: "fita",
            where: sequelize.where(
                sequelize.literal("anoprev * 100 + semanaprev"),
                {
                    [Op.between]: [startKey, endKey],
                }
            ),
            order: [["anoprev", "ASC"], ["semanaprev", "ASC"]],
        });

        return records.map(r => r.dataValues as ResumoPrevisao);
    }

    async update(idresumo: number, resumo: Partial<ResumoPrevisao>, transaction: Transaction): Promise<boolean> {
        const [affectedCount] = await this.model.update(resumo, { where: { idresumo } });
        return affectedCount > 0;
    }

    async listByBetweenYearMonth(mesInicial: number, mesFinal: number, anoInicial: number, anoFinal: number): Promise<ResumoPrevisao[]> {
        const valorInicial = anoInicial * 100 + mesInicial;
        const valorFinal = anoFinal * 100 + mesFinal;

        const records = await this.model.findAll({
            where: sequelize.literal(`(anoprev * 100 + mes) BETWEEN ${valorInicial} AND ${valorFinal}`)
        });
        return records.map((r) => r.dataValues as ResumoPrevisao);
    }
}
