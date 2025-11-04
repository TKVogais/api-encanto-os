import { CreateLoteDto, ResCreateLoteDto, ResUpdateLoteDto } from "../DTOs/lotes";
import { Lote } from "../entities/lotes";
import { ILoteRepository, ILoteService } from "../interfaces/lotes";

export class LotesService implements ILoteService {
    static readonly ERROR_REPO = "É necessário fornecer um repository.";
    constructor(private repository: ILoteRepository) {
        if (!repository) throw new Error(LotesService.ERROR_REPO);
    }

    async create(lote: CreateLoteDto): Promise<ResCreateLoteDto> {
        try {
            const loteEncontrado = await this.repository.findByLote(lote.lote)

            if (loteEncontrado) {
                return {
                    status: 400,
                    message: "O Lote já está cadastrado!"
                }
            }

            const response = await this.repository.create(lote);
            return {
                status: 200,
                message: "Lote cadastrado com sucesso!",
                lote: response
            };
        } catch (error: any) {
            console.log(error)
            return { status: 500, message: "Falha ao cadastrar o lote!" };
        }
    }
    list(): Promise<Lote[]> {
        return this.repository.list()
    }
    findByLote(lote: string): Promise<Lote | null> {
        return this.repository.findByLote(lote)
    }
    async update(lote: Lote): Promise<ResUpdateLoteDto> {
        try {
            const { idlote, ...leftLote } = lote
            const loteAtualizado = await this.repository.update(idlote, leftLote)
            if (loteAtualizado) {
                return {
                    status: 200,
                    message: "Lote atualizado com sucesso!",
                    lote: lote
                };
            }
            return {
                status: 400,
                message: "O lote não foi atualizado",
                lote: null
            };

        } catch (error: any) {

            console.log(error)
            return {
                status: 500,
                message: "Falha ao atualizar o lote!"
            };
        }
    }

}