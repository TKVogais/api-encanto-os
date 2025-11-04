import { IPessoaRepository, IPessoaService } from "../interfaces/pessoas";
import { Pessoa } from "../entities/pessoa";
import { Transaction } from "sequelize";
import { CreatePessoaDto, ResCreatePessoaDto, ResUpdatePessoaDto } from "../DTOs/pessoas";

export class PessoasService implements IPessoaService {
   static readonly ERROR_REPO = "É necessário fornecer um repository.";

   constructor(private repository: IPessoaRepository) {
      if (!repository) throw new Error(PessoasService.ERROR_REPO);
   }
   async update(pessoa: Pessoa): Promise<ResUpdatePessoaDto> {
     try {
            const { idpessoa, ...leftPessoa } = pessoa
            const pessoaAtualizada = await this.repository.update(idpessoa, leftPessoa)
            if (pessoaAtualizada) {
                return {
                    status: 200,
                    message: "Pessoa atualizada com sucesso!",
                    pessoa: pessoa
                };
            }
            return {
                status: 500,
                message: "Falha ao cadastrar a pessoa!",
                pessoa: null
            };

        } catch (error: any) {
            return {
                status: 500,
                message: "Falha ao cadastrar a pessoa!"
            };
        }
   }
   async findByCNPJ(cpf_cnpj: string): Promise<Pessoa | null> {
      return this.repository.findByCNPJ(cpf_cnpj)
   }

   async create(pessoa: CreatePessoaDto, t?: Transaction): Promise<ResCreatePessoaDto> {
      try {

         const pessoaEncontrada = await this.findByCNPJ(pessoa.cpfcnpj)
   
         if (pessoaEncontrada) {
            return {
               status: 400,
               message: "A pessoa já está cadastrada!"
            }
         }

         const data = await this.repository.create(pessoa, t);
         return {
            status: 200,
            message: "Pessoa cadastrada com sucesso!",
            pessoa: data
         };
      } catch (error: any) {
         console.log(error)
         return { status: 500, message: error.message };
      }
   }

   async list(): Promise<Pessoa[]> {
      return await this.repository.list();
   }

}
