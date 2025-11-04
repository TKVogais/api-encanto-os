import { Model, ModelStatic, Transaction, Op } from "sequelize";
import { IInventarioCachosRepository } from "../interfaces/inventariocachos";
import { CreateInventarioCachosDto, UpdateInventarioCachosDto } from "../DTOs/inventariocachos";
import { InventarioCachos } from "../entities/inventariocachos";

export class InventarioCachosRepository implements IInventarioCachosRepository {
  constructor(private model: ModelStatic<Model<any, any>>) { }

  async create(inventario: CreateInventarioCachosDto, transaction?: Transaction): Promise<InventarioCachos> {
    const { dataValues } = await this.model.create(inventario as any, { transaction });
    return dataValues as InventarioCachos;
  }

  async list(): Promise<any[]> {
    const records = await this.model.findAll({
      attributes: ["idinventario", "total"],
      include: [
        {
          association: "area",
          attributes: ["idarea", "area"],
          include: [
            {
              association: "lote",
              attributes: ["lote"],
            },
          ],
        },
        {
          association: "fita",
          attributes: ["fita", "hex", "idfita"],
        },
      ],
    });

    // Desestruturação dos objetos internos
    return records
      .map((r: any) => {
        const { idinventario, total, area, fita } = r.dataValues;
        const { idarea, area: nomeArea, lote } = area || {};
        const { fita: nomeFita, hex, idfita } = fita || {};

        return {
          idinventario,
          idarea,
          area: nomeArea,
          lote: lote?.lote,
          fita: nomeFita,
          cor: hex,
          total,
          idfita
        };
      })
      .sort((a, b) => {
        // primeiro por idfita
        if (a.idfita !== b.idfita) return a.idfita - b.idfita;
        // depois por idarea
        return a.idarea - b.idarea;
      });

  }


  async update(idinventario: number, inventario: Partial<InventarioCachos>, transaction?: Transaction): Promise<boolean> {
    const [affectedCount] = await this.model.update(inventario, { where: { idinventario }, transaction });
    return affectedCount > 0;
  }

  async bulkCreate(dataList: CreateInventarioCachosDto[], transaction?: Transaction): Promise<InventarioCachos[]> {
    if (!dataList.length) return [];
    const records = await this.model.bulkCreate(dataList as any, { transaction });
    return records.map(r => r.dataValues as InventarioCachos);
  }

  async bulkUpdate(dataList: UpdateInventarioCachosDto[], transaction?: Transaction): Promise<void> {
    if (!dataList.length) return;

    // Atualiza um por um para garantir segurança dentro da transação
    await Promise.all(
      dataList.map(item =>
        this.model.update(item, {
          where: { idinventario: item.idinventario },
          transaction,
        })
      )
    );
  }

  async findAllByAreasEFitas(
    dataList: { idarea: number; idfita: number }[],
    transaction?: Transaction
  ): Promise<InventarioCachos[]> {
    if (!dataList.length) return [];

    // Gera a lista única de combinações idarea+idfita
    const conditions = dataList.map(d => ({ idarea: d.idarea, idfita: d.idfita }));

    const records = await this.model.findAll({
      where: {
        [Op.or]: conditions,
      },
      transaction,
    });

    return records.map(r => r.dataValues as InventarioCachos);
  }
}
