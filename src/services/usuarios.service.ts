import { IUsuarioRepository, IUsuarioService } from "../interfaces/usuarios";
import { CreateUsuarioDto, FindUserWithPerm, ResCreateUsuarioDto, UpdatePermissoesDto, UsuariosDto } from "../DTOs/usuarios";
import { Usuario } from "../entities/usuario";
import { IPessoaService } from "../interfaces/pessoas";
import { DefaultResponseApi } from "../DTOs/defaults";
import { Transaction } from "sequelize";
import sequelize from "../sequelize/config/config";
const { hash } = require("../util/hash")

export class UsuarioService implements IUsuarioService {
   static readonly ERROR_REPO = "É necessário fornecer um repository.";
   static readonly ERROR_SERV_PESSOA = "É necessário fornecer uma service de pessoa.";
   constructor(
      private repository: IUsuarioRepository,
      private servicePessoa: IPessoaService
   ) {
      if (!repository) throw new Error(UsuarioService.ERROR_REPO);
      if (!servicePessoa) throw new Error(UsuarioService.ERROR_SERV_PESSOA);
   }
   async updatePermissoes(permissoesDto: UpdatePermissoesDto): Promise<DefaultResponseApi> {
      const t: Transaction = await sequelize.transaction();

      try {
         const { idusuario, permissoes } = permissoesDto;

         // 1️⃣ Deleta permissões antigas do usuário
         await this.repository.deletePermissoes(idusuario, t);

         // 2️⃣ Cria as novas permissões
         await this.repository.updatePermissoes(permissoesDto, t);

         await t.commit();

         return {
            message: 'Permissões atualizadas com sucesso!',
            status: 200
         };
      } catch (error) {
         await t.rollback();
         console.error('Erro ao substituir permissões:', error);

         return {
            message: 'Erro ao atualizar permissões',
            status: 500
         };
      }
   }

   async update(usuario: CreateUsuarioDto): Promise<ResCreateUsuarioDto> {
      try {
         const { alterarSenha, ...leftUsuario } = usuario;
         const usuarioHashed = alterarSenha ? {
            ...leftUsuario,
            senha: await hash(leftUsuario.senha, 10)
         } : leftUsuario

         const updated = await this.repository.update(leftUsuario.idusuario, usuarioHashed);
         if (updated) {
            return {
               status: 200,
               message: "Usuário atualizado com sucesso!",
               usuario: {
                  ...leftUsuario,
                  senha: "",
                  idusuario: leftUsuario.idusuario ?? 0,
                  permissoes: []
               }
            };
         }
         return {
            status: 400,
            message: "O usuário não foi atualizado!",
            usuario: null,
         };
      } catch (error: any) {
         console.log(error);
         return {
            status: 500,
            message: "Falha ao atualizar o usuário!",
         };
      }
   }
   async findByUserWithPermissoes(usuario: string): Promise<FindUserWithPerm> {
      return this.repository.findByUserWithPermissoes(usuario)
   }
   async findByUser(usuario: string): Promise<Usuario | null> {
      return this.repository.findByUser(usuario)
   }

   async create(data: CreateUsuarioDto): Promise<ResCreateUsuarioDto> {
      const { idpessoa, usuario, senha, pessoa, tipousuario, status } = data
      // const transaction = await sequelize.transaction()
      let idpessoaDB = null
      try {
         const foundUser = await this.findByUser(usuario)

         if (foundUser) {
            return {
               status: 400,
               message: "O usuário já está cadastrado!"
            }
         }

         // if (pessoa) {
         //    const response = await this.servicePessoa.create(pessoa, transaction)
         //    if (response.status !== 200) {
         //       return {
         //          message: response.message,
         //          status: response.status
         //       }
         //    }
         //    idpessoaDB = response.pessoa.idpessoa
         // }

         const usuarioDB = {
            usuario: usuario,
            senha: await hash(senha, 10),
            idpessoa: pessoa ? idpessoaDB : idpessoa,
            status: status,
            tipousuario: tipousuario
         }
         const response = await this.repository.create(usuarioDB)
         // await transaction.commit();
         return {
            status: 200,
            message: "Usuário cadastrado com sucesso!",
            usuario: {
               idusuario: response.idusuario,
               usuario: response.usuario,
               tipousuario: response.tipousuario,
               status: response.status,
               senha: "",
               permissoes: []
            }
         }
      } catch (error) {
         console.log(error)

         return {
            status: 500,
            message: "Falha ao cadastrar o usuário!"
         }
      }
   }

   async list(): Promise<UsuariosDto[]> {
      return await this.repository.list();

   }

}
