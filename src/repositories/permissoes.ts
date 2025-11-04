// src/repositories/pessoas.repository.ts
import { Model, ModelStatic } from "sequelize";
import { IPermissaoRepository } from "../interfaces/permissoes";
import { CreatePermissaoDTO } from "../DTOs/permissao";
import { Permissao } from "../entities/permissao";
const database = require("../sequelize/config/config")


export class PermissoesRepository implements IPermissaoRepository {
   private model: ModelStatic<Model<any, any>>;

   static readonly ERROR_MODEL_REQUIRED = "É necessário fornecer uma model.";

   constructor(model: ModelStatic<Model<any, any>>) {
      if (!model) throw new Error(PermissoesRepository.ERROR_MODEL_REQUIRED);
      this.model = model;
   }
   async update(idpermissao: number, permissao: Partial<Permissao>): Promise<boolean> {
      const [affectedCount] = await this.model.update(permissao, {
         where: { idpermissao }
      });
      return affectedCount > 0;
   }


   async create(permissao: CreatePermissaoDTO): Promise<Permissao> {
      const { dataValues } = await this.model.create({
         permissao: permissao.permissao,
         descricao: permissao.descricao
      });

      return dataValues as Permissao;
   }
   async list(): Promise<Permissao[]> {
      const record = await this.model.findAll()
      return record.map(record => record.dataValues as Permissao)
   }
   async findByPermissao(permissao: string): Promise<Permissao | null> {
      const record = await this.model.findOne({
         where: {
            permissao
         }
      })
      return record?.dataValues as Permissao || null;
   }
}
