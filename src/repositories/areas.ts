import { Model, ModelStatic } from "sequelize";
import { IAreaRepository } from "../interfaces/areas";
import { CreateAreaDto } from "../DTOs/areas";
import { Area } from "../entities/areas";

export class AreasRepository implements IAreaRepository {
  private model: ModelStatic<Model<any, any>>;
  private loteModel: ModelStatic<Model<any, any>>;

  static readonly ERROR_MODEL_REQUIRED = "É necessário fornecer uma model.";

  constructor(model: ModelStatic<Model<any, any>>, loteModel: ModelStatic<Model<any, any>>) {
    if (!model) throw new Error(AreasRepository.ERROR_MODEL_REQUIRED);
    if (!loteModel) throw new Error(AreasRepository.ERROR_MODEL_REQUIRED);
    this.model = model;
    this.loteModel = loteModel;
  }

  async create(area: CreateAreaDto): Promise<Area> {
    const { dataValues } = await this.model.create({
      idlote: area.idlote,
      hect: area.hect,
      hectplant: area.hectplant,
      plantas: area.plantas,
      area: area.area
    });
    return dataValues as Area;
  }

  async list(): Promise<Area[]> {
    const records = await this.model.findAll({
      include: [{ model: this.loteModel, as: "lote" }], // deve bater com o alias do belongsTo
    });
    return records.map((r) => r.dataValues as Area);
  }

  async findByArea(area: string): Promise<Area | null> {
    const record = await this.model.findOne({
      where: { area },
      include: [{ model: this.loteModel, as: "lote" }], // agora está igual
    });
    return record?.dataValues as Area || null;
  }

  async update(idarea: number, area: Partial<Area>): Promise<boolean> {
    const [affectedCount] = await this.model.update(area, { where: { idarea } });
    return affectedCount > 0;
  }
}
