// src/services/fitas.service.ts
import { CreateFitaDto, ResCreateFitaDto, ResUpdateFitaDto } from "../DTOs/fitas";
import { Fita } from "../entities/fitas";
import { IFitaRepository, IFitaService } from "../interfaces/fitas";

export class FitasService implements IFitaService {
  static readonly ERROR_REPO = "É necessário fornecer um repository.";

  constructor(private repository: IFitaRepository) {
    if (!repository) throw new Error(FitasService.ERROR_REPO);
  }

  async create(fita: CreateFitaDto): Promise<ResCreateFitaDto> {
    try {
      const existente = await this.repository.findByFita(fita.fita);
      if (existente) {
        return { status: 400, message: "A fita já está cadastrada!" };
      }

      const response = await this.repository.create(fita);
      return { status: 200, message: "Fita cadastrada com sucesso!", fita: response };
    } catch (error: any) {
      console.error(error);
      return { status: 500, message: "Falha ao cadastrar a fita!" };
    }
  }

  list(): Promise<Fita[]> {
    return this.repository.list();
  }

  findByFita(fita: string): Promise<Fita | null> {
    return this.repository.findByFita(fita);
  }

  async update(fita: Fita): Promise<ResUpdateFitaDto> {
    try {
      const { idfita, ...rest } = fita;
      const atualizado = await this.repository.update(idfita, rest);

      if (atualizado) {
        return { status: 200, message: "Fita atualizada com sucesso!", fita };
      }

      return { status: 400, message: "A fita não foi atualizada", fita: null };
    } catch (error: any) {
      console.error(error);
      return { status: 500, message: "Falha ao atualizar a fita!" };
    }
  }
}
