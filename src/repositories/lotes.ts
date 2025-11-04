import { Model, ModelStatic } from "sequelize";
import { ILoteRepository } from "../interfaces/lotes";
import { CreateLoteDto } from "../DTOs/lotes";
import { Lote } from "../entities/lotes";

export class LotesRepository implements ILoteRepository {
    private model: ModelStatic<Model<any, any>>;

    static readonly ERROR_MODEL_REQUIRED = "É necessário fornecer uma model.";

    constructor(model: ModelStatic<Model<any, any>>) {
        if (!model) throw new Error(LotesRepository.ERROR_MODEL_REQUIRED);
        this.model = model;
    }

    async create(lote: CreateLoteDto): Promise<Lote> {
        const { dataValues } = await this.model.create({
            lote: lote.lote,
            descricao: lote.descricao
        }
        );
        return dataValues as Lote;
    }
    async list(): Promise<Lote[]> {
        const records = await this.model.findAll();
        return records.map(record => record.dataValues as Lote);
    }
    async findByLote(lote: string): Promise<Lote | null> {
        const record = await this.model.findOne({ where: { lote } })
        return record?.dataValues as Lote || null;
    }
    async update(idlote: number, lote: Partial<Lote>): Promise<boolean | null> {
        const [affectedCount] = await this.model.update(lote, {
            where: { idlote }
        });
        return affectedCount > 0;
    }
}