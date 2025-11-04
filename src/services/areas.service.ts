import { CreateAreaDto, ResCreateAreaDto, ResUpdateAreaDto } from "../DTOs/areas";
import { Area } from "../entities/areas";
import { IAreaRepository, IAreaService } from "../interfaces/areas";

export class AreasService implements IAreaService {
  static readonly ERROR_REPO = "É necessário fornecer um repository.";

  constructor(private repository: IAreaRepository) {
    if (!repository) throw new Error(AreasService.ERROR_REPO);
  }

  async create(area: CreateAreaDto): Promise<ResCreateAreaDto> {
    try {
      const response = await this.repository.create(area);
      return {
        status: 200,
        message: "Área cadastrada com sucesso!",
        area: response,
      };
    } catch (error: any) {
      console.log(error);
      return { status: 500, message: "Falha ao cadastrar a área!" };
    }
  }

  list(): Promise<Area[]> {
    return this.repository.list();
  }

  findByArea(area: string): Promise<Area | null> {
    return this.repository.findByArea(area);
  }

  async update(area: Area): Promise<ResUpdateAreaDto> {
    try {
      const { idarea, ...leftArea } = area;
      const updated = await this.repository.update(idarea, leftArea);
      if (updated) {
        return {
          status: 200,
          message: "Área atualizada com sucesso!",
          area,
        };
      }
      return {
        status: 400,
        message: "A área não foi atualizada",
        area: null,
      };
    } catch (error: any) {
      console.log(error);
      return {
        status: 500,
        message: "Falha ao atualizar a área!",
      };
    }
  }
}
