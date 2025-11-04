// src/repositories/pessoas.repository.ts
import { Model, ModelStatic, Transaction } from "sequelize";
import { Pessoa } from "../entities/pessoa";
import { IPessoaRepository } from "../interfaces/pessoas";
import { CreatePessoaDto } from "../DTOs/pessoas";

export class PessoaRepository implements IPessoaRepository {
   private model: ModelStatic<Model<any, any>>;

   static readonly ERROR_MODEL_REQUIRED = "É necessário fornecer uma model.";

   constructor(model: ModelStatic<Model<any, any>>) {
      if (!model) throw new Error(PessoaRepository.ERROR_MODEL_REQUIRED);
      this.model = model;
   }
   async update(idpessoa: number, pessoa: Partial<Pessoa>): Promise<boolean> {
       const [affectedCount] = await this.model.update(pessoa, {
            where: { idpessoa }
        });
        return affectedCount > 0;
   }

   // Cria uma pessoa
   async create(pessoa: CreatePessoaDto, t?: Transaction): Promise<Pessoa> {
      const { dataValues } = await this.model.create(
         {
            name: pessoa.name,
            sobrenome: pessoa.sobrenome,
            tipopessoa: pessoa.tipopessoa,
            cpfcnpj: pessoa.cpfcnpj,
            logradouro: pessoa.logradouro,
            cep: pessoa.cep,
            cidade: pessoa.cidade,
            estado: pessoa.estado,
            numero: pessoa.numero,
            email: pessoa.email,
            telefone: pessoa.telefone,
            urlimage: pessoa.urlimage || null, // default se não vier
            datanasc: pessoa.datanasc,
            estadocivil: pessoa.estadocivil,
            bairro: pessoa.bairro,
         },
         t ? { transaction: t } : undefined
      );

      return dataValues as Pessoa;
   }


   // Lista todas as pessoas
   async list(): Promise<Pessoa[]> {
      const records = await this.model.findAll();
      return records.map(record => record.dataValues as Pessoa);
   }

   // Busca pessoa pelo CPF/CNPJ
   async findByCNPJ(cpfcnpj: string): Promise<Pessoa | null> {
      const record = await this.model.findOne({
         where: { cpfcnpj }
      });
      return record?.dataValues as Pessoa || null;
   }
}
