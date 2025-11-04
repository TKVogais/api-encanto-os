import { CreateAjusteFitaDto, ResCreateAjusteFitaDto } from "../DTOs/ajustesfitas";
import { CreateInventarioCachosDto, UpdateInventarioCachosDto } from "../DTOs/inventariocachos";
import { AjusteFita } from "../entities/ajustesfitas";
import { IAjustesFitasRepository, IAjustesFitasService } from "../interfaces/ajustesfitas";
import { IInventarioCachosService } from "../interfaces/inventariocachos";
import sequelize from "../sequelize/config/config";

export class AjustesFitasService implements IAjustesFitasService {
  constructor(
    private repository: IAjustesFitasRepository,
    private serviceInventario: IInventarioCachosService
  ) {
    if (!repository) throw new Error("É necessário fornecer um repository.");
  }

  async bulkCreate(dataList: CreateAjusteFitaDto[]): Promise<ResCreateAjusteFitaDto> {
    const transaction = await sequelize.transaction();
    try {
      const created = await this.repository.bulkCreate(dataList, transaction);
      const inventarioInput = dataList.map(item => ({
        idarea: item.idarea,
        idfita: item.idfita,
      }));

      const inventarioExistente = await this.serviceInventario.findAllByAreasEFitas(inventarioInput, transaction);


      const novosInventarios: CreateInventarioCachosDto[] = [];
      const inventariosAtualizar: UpdateInventarioCachosDto[] = [];

      for (const item of dataList) {
        const existente = inventarioExistente.find(
          inv => inv.idarea === item.idarea && inv.idfita === item.idfita
        );

        if (existente) {
          inventariosAtualizar.push({
            idinventario: existente.idinventario,
            idarea: existente.idarea,
            idfita: existente.idfita,
            colhidos: existente.colhidos,
            total: existente.total - Number(item.cachos),
            ajustes: existente.ajustes + Number(item.cachos),
            coracoes: existente.coracoes,
          });
        } else {
          novosInventarios.push({
            idarea: item.idarea,
            idfita: item.idfita,
            coracoes: 0,
            colhidos: 0,
            ajustes: Number(item.cachos),
            total: Number(-item.cachos),
          });
        }
      }
      console.log("Break Point 14 - Novos inventários:", novosInventarios.length, "Atualizações:", inventariosAtualizar.length);

      if (novosInventarios.length > 0) {
        console.log("Break Point 15 - Criando novos inventários");
        await this.serviceInventario.bulkCreate(novosInventarios as any, transaction);
      }
      if (inventariosAtualizar.length > 0) {
        console.log("Break Point 16 - Atualizando inventários existentes");
        await this.serviceInventario.bulkUpdate(inventariosAtualizar, transaction);
      }

      await transaction.commit();
      return { status: 200, message: "Ajustes cadastrados com sucesso!", ajustes: created };
    } catch (error: any) {
      await transaction.rollback();
      console.error(error);
      return { status: 500, message: error.message || "Falha ao cadastrar ajustes!" };
    }
  }

  list(): Promise<AjusteFita[]> {
    return this.repository.list();
  }
}
