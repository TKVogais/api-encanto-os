import { CreatePermissaoDTO, ResCreatePermissaoDto, ResUpdatePermissaoDto } from "../DTOs/permissao";
import { Permissao } from "../entities/permissao";
import { IPermissaoRepository, IPermissaoService } from "../interfaces/permissoes";

export class PermissoesService implements IPermissaoService {
    static readonly ERROR_REPO = "É necessário fornecer um repository.";

    constructor(private repository: IPermissaoRepository) {
        if (!repository) throw new Error(PermissoesService.ERROR_REPO);
    }
    async update(permissao: Permissao): Promise<ResUpdatePermissaoDto> {
        try {
            const { idpermissao, ...leftPermissao } = permissao
            const permissaoAtualizada = await this.repository.update(idpermissao, leftPermissao)
            if (permissaoAtualizada) {
                return {
                    status: 200,
                    message: "Permissão atualizada com sucesso!",
                    permissao: permissao
                };
            }
            return {
                status: 500,
                message: "Falha ao atualizar a permissão!",
                permissao: null
            };

        } catch (error: any) {
            return {
                status: 500,
                message: "Falha ao cadastrar o banco!"
            };
        }
    }

    async create(permissao: CreatePermissaoDTO): Promise<ResCreatePermissaoDto> {
        try {
            const permissaoEncontrada = await this.findByPermissao(permissao.permissao)

            if (permissaoEncontrada) {
                return {
                    status: 400,
                    message: "A permissão já está cadastrada!"
                }
            }

            const data = await this.repository.create(permissao);
            return {
                status: 200,
                message: "Permissão cadastrada com sucesso!",
                permissao: data
            };
        } catch (error: any) {
            console.log(error)
            return { status: 500, message: error.message };
        }
    }
    async list(): Promise<Permissao[]> {
        return await this.repository.list();
    }
    async findByPermissao(permissao: string): Promise<Permissao | null> {
        return await this.repository.findByPermissao(permissao)
    }

}