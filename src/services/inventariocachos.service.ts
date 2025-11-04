import { Transaction } from "sequelize";
import { CreateInventarioCachosDto, ListInventarioDto, ResCreateInventarioCachosDto, ResUpdateInventarioCachosDto } from "../DTOs/inventariocachos";
import { InventarioCachos } from "../entities/inventariocachos";
import { IInventarioCachosRepository, IInventarioCachosService } from "../interfaces/inventariocachos";
import { IParamsAnuaisService } from "../interfaces/params";

export class InventarioCachosService implements IInventarioCachosService {
  constructor(
    private repository: IInventarioCachosRepository,
    private serviceParams: IParamsAnuaisService
  ) { }

  async findAllByAreasEFitas(dataList: { idarea: number; idfita: number; }[], transaction?: Transaction): Promise<InventarioCachos[]> {
    return this.repository.findAllByAreasEFitas(dataList, transaction)
  }

  async create(inventario: CreateInventarioCachosDto): Promise<ResCreateInventarioCachosDto> {
    try {
      const response = await this.repository.create(inventario);
      return { status: 200, message: "Inventário cadastrado com sucesso!", inventario: response };
    } catch (error: any) {
      console.log(error);
      return { status: 500, message: "Falha ao cadastrar inventário!" };
    }
  }

  async list(): Promise<ListInventarioDto> {

    const ano = new Date().getFullYear()

    const [inventario, params] = await Promise.all([
      this.repository.list(),
      this.serviceParams.findByYear(ano)
    ])

    return {
      inventario,
      params
    }
  }

  async update(inventario: InventarioCachos): Promise<ResUpdateInventarioCachosDto> {
    try {
      const updated = await this.repository.update(inventario.idinventario, inventario);
      if (updated) return { status: 200, message: "Inventário atualizado com sucesso!", inventario };
      return { status: 400, message: "Inventário não foi atualizado", inventario: null };
    } catch (error: any) {
      console.log(error);
      return { status: 500, message: "Falha ao atualizar inventário!" };
    }
  }

  // ------------------- Bulk Create -------------------
  async bulkCreate(dataList: CreateInventarioCachosDto[], transaction: Transaction): Promise<ResCreateInventarioCachosDto> {
    try {
      // Filtra duplicados (idarea + idfita)
      const validData = dataList.filter((item, index, self) =>
        index === self.findIndex(d => d.idarea === item.idarea && d.idfita === item.idfita)
      );

      if (!validData.length) {
        await transaction.rollback();
        return { status: 200, message: "Todos os inventários já estão cadastrados!" };
      }

      const created = await this.repository.bulkCreate(validData, transaction);
      return { status: 200, message: "Inventários cadastrados com sucesso!", inventario: created[0] };
    } catch (error: any) {
      console.error(error);
      return { status: 500, message: error.message || "Falha ao cadastrar inventários!" };
    }
  }

  // ------------------- Bulk Update -------------------
  async bulkUpdate(dataList: InventarioCachos[], transaction: Transaction): Promise<ResCreateInventarioCachosDto> {
    try {
      // Atualiza sequencialmente cada registro
      for (const item of dataList) {
        await this.repository.update(item.idinventario, item, transaction);
      }
      return { status: 200, message: "Inventários atualizados com sucesso!" };
    } catch (error: any) {
      console.error(error);
      return { status: 500, message: error.message || "Falha ao atualizar inventários!" };
    }
  }
}
