import { Model, ModelStatic } from "sequelize";
import { CreateBancoDto } from "../DTOs/bancos";
import { Banco } from "../entities/bancos";
import { IBancoRepository } from "../interfaces/bancos";

export class BancosRepository implements IBancoRepository {

    private model: ModelStatic<Model<any, any>>;

    static readonly ERROR_MODEL_REQUIRED = "É necessário fornecer uma model.";

    constructor(model: ModelStatic<Model<any, any>>) {
        if (!model) throw new Error(BancosRepository.ERROR_MODEL_REQUIRED);
        this.model = model;
    }

    async create(banco: CreateBancoDto): Promise<Banco> {
        const { dataValues } = await this.model.create({
            banco: banco.banco,
            cnpj: banco.cnpj,
            codigo: banco.codigo,
            urlimage: banco.urlimage
        }
        );
        return dataValues as Banco;
    }
    async list(): Promise<Banco[]> {
        const records = await this.model.findAll();
        return records.map(record => record.dataValues as Banco);
    }
    async findByBanco(banco: string): Promise<Banco | null> {
        const record = await this.model.findOne({ where: { banco } })
        return record?.dataValues as Banco || null;
    }
    async update(idbanco: number, banco: Partial<Banco>): Promise<boolean | null> {
        const [affectedCount] = await this.model.update(banco, {
            where: { idbanco }
        });
        return affectedCount > 0;
    }

}