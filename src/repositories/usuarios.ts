// src/repositories/pessoas.repository.ts
import { Model, ModelStatic, Transaction } from "sequelize";
import { IUsuarioRepository } from "../interfaces/usuarios";
import { CreateUsuarioDto, FindUserWithPerm, UpdatePermissoesDto, UsuariosDto } from "../DTOs/usuarios";
import { Usuario } from "../entities/usuario";

export class UsuarioRepository implements IUsuarioRepository {
   private model: ModelStatic<Model<any, any>>;
   private modelPermissoes: ModelStatic<Model<any, any>>;
   private modelPessoa: ModelStatic<Model<any, any>>;
   private modelPermissoesUsuarios: ModelStatic<Model<any, any>>;
   static readonly ERROR_MODEL_REQUIRED = "É necessário fornecer uma model.";

   constructor(
      model: ModelStatic<Model<any, any>>,
      modelPermissoes: ModelStatic<Model<any, any>>,
      modelPessoas: ModelStatic<Model<any, any>>,
      modelPermissoesUsuarios: ModelStatic<Model<any, any>>
   ) {
      if (!model || !modelPermissoes || !modelPessoas) throw new Error(UsuarioRepository.ERROR_MODEL_REQUIRED);
      this.model = model;
      this.modelPermissoes = modelPermissoes
      this.modelPessoa = modelPessoas
      this.modelPermissoesUsuarios = modelPermissoesUsuarios
   }
   async updatePermissoes(permissoesDto: UpdatePermissoesDto, t: Transaction): Promise<boolean> {
      const result = await this.modelPermissoesUsuarios.bulkCreate(permissoesDto.permissoes, { transaction: t })
      return result.length > 0
   }
   async deletePermissoes(idusuario: number, t: Transaction): Promise<boolean> {
      const affectedCount = await this.modelPermissoesUsuarios.destroy({ where: { idusuario: idusuario }, transaction: t });
      return affectedCount > 0;
   }
   async update(idusuario: number, usuario: Partial<Usuario>): Promise<boolean> {
      const [affectedCount] = await this.model.update(usuario, { where: { idusuario } });
      return affectedCount > 0;
   }
   async findByUserWithPermissoes(usuario: string): Promise<UsuariosDto | null> {
      const record = await this.model.findOne({
         where: { usuario },
         attributes: ["idusuario", "usuario", "status", "tipousuario", "senha"],
         include: [
            {
               model: this.modelPermissoes,
               as: "Permissaos",
               attributes: ["idpermissao", "permissao", "descricao"],
               through: { attributes: [] }, // remove colunas da tabela pivô
            },
            {
               model: this.modelPessoa,
               as: "Pessoa",
               attributes: ["idpessoa", "name", "email", "urlimage", "sobrenome"],
            },
         ],
      });

      if (!record) return null;

      const { idusuario, usuario: nomeUsuario, Permissaos, Pessoa, tipousuario, status, senha } = record.dataValues as any;

      // mapeia permissões
      const permissoes = Permissaos?.map((p: any) => ({
         idpermissao: p.idpermissao,
         permissao: p.permissao,
         descricao: p.descricao,
      })) || [];

      // mapeia pessoa
      const pessoa = Pessoa
         ? {
            idpessoa: Pessoa.idpessoa,
            name: Pessoa.name,
            email: Pessoa.email,
            urlimage: Pessoa.urlimage,
            sobrenome: Pessoa.sobrenome,
         }
         : null;

      return {
         idusuario,
         usuario: nomeUsuario,
         permissoes,
         pessoa,
         status,
         tipousuario,
         senha: senha, // nunca retorna senha
      };
   }


   async findByUser(usuario: string): Promise<Usuario | null> {
      const record = await this.model.findOne({
         where: {
            usuario
         }
      })

      return record?.dataValues as Usuario || null;
   }

   // Cria um usuário
   async create(usuario: CreateUsuarioDto, t?: Transaction): Promise<Usuario> {
      const { dataValues } = await this.model.create({
         usuario: usuario.usuario,
         senha: usuario.senha,
         idpessoa: usuario.idpessoa,
         tipousuario: usuario.tipousuario,
         status: usuario.status
      },
         t && { transaction: t }
      );

      return dataValues as Usuario;
   }

   // Lista todas as pessoas
   async list(): Promise<UsuariosDto[]> {
      const records = await this.model.findAll({
         attributes: ["idusuario", "usuario", "status", "tipousuario"],
         include: [
            {
               model: this.modelPermissoes,
               as: "Permissaos",
               attributes: ["idpermissao", "permissao", "descricao"],
               through: { attributes: [] }, // remove a tabela pivô
            },
            {
               model: this.modelPessoa,
               as: "Pessoa",
               attributes: ["idpessoa", "name", "email", "urlimage", "sobrenome"],
            },
         ],
      });

      const usuariosLimpos = records.map((record) => {
         const { idusuario, usuario, Permissaos, Pessoa, tipousuario, status, sobrenome } = record.dataValues as any;

         // mapeia permissões
         const permissoes = Permissaos?.map((p: any) => ({
            idpermissao: p.idpermissao,
            permissao: p.permissao,
            descricao: p.descricao,
         })) || [];

         // mapeia pessoa
         const pessoa = Pessoa
            ? {
               idpessoa: Pessoa.idpessoa,
               name: Pessoa.name,
               email: Pessoa.email,
               urlimage: Pessoa.urlimage,
               sobrenome: Pessoa.sobrenome
            }
            : null;

         return {
            idusuario,
            usuario,
            permissoes,
            pessoa,
            status,
            tipousuario,
            sobrenome,
            senha: ""
         };
      });

      return usuariosLimpos;
   }
}
