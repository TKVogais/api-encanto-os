import { CreateBancoDto, ResCreateBancoDto, ResUpdateBancoDto } from "../DTOs/bancos";
import { Banco } from "../entities/bancos";
import { IBancoRepository, IBancoService } from "../interfaces/bancos";

export class BancoService implements IBancoService {
    static readonly ERROR_REPO = "É necessário fornecer um repository.";
    constructor(private repository: IBancoRepository) {
        if (!repository) throw new Error(BancoService.ERROR_REPO);
    }

    async create(banco: CreateBancoDto): Promise<ResCreateBancoDto> {
        try {
            const bancoEncontrado = await this.findByBanco(banco.banco)

            if (bancoEncontrado) {
                return {
                    status: 400,
                    message: "O Banco já está cadastrado!"
                }
            }

            const response = await this.repository.create(banco);
            return {
                status: 200,
                message: "Banco cadastrado com sucesso!",
                banco: response
            };
        } catch (error: any) {
            return { status: 500, message: "Falha ao cadastrar o banco!" };
        }
    }
    list(): Promise<Banco[]> {
        return this.repository.list()
    }
    findByBanco(banco: string): Promise<Banco | null> {
        return this.repository.findByBanco(banco)
    }
    async update(banco: Banco): Promise<ResUpdateBancoDto> {
        try {
            const { idbanco, ...leftBanco } = banco
            const bancoAtualizado = await this.repository.update(idbanco, leftBanco)
            if (bancoAtualizado) {
                return {
                    status: 200,
                    message: "Banco atualizado com sucesso!",
                    banco: banco
                };
            }
            return {
                status: 500,
                message: "Falha ao cadastrar o banco!",
                banco: null
            };

        } catch (error: any) {
            return {
                status: 500,
                message: "Falha ao cadastrar o banco!"
            };
        }
    }

}