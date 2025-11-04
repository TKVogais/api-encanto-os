import { Model, ModelStatic, Transaction, Op, literal, col, fn, QueryTypes } from "sequelize";
import { IColheitaRepository } from "../interfaces/colheita";
import { ColheitasHectares, CreateColheitaDto, MediaColheita } from "../DTOs/colheita";
import { Colheita } from "../entities/colheita";
import sequelize from "../sequelize/config/config";

export class ColheitasRepository implements IColheitaRepository {
  private model: ModelStatic<Model<any, any>>;
  private areaModel: ModelStatic<Model<any, any>>;

  static readonly ERROR_MODEL_REQUIRED = "É necessário fornecer uma model.";

  constructor(model: ModelStatic<Model<any, any>>, areaModel: ModelStatic<Model<any, any>>) {
    if (!model) throw new Error(ColheitasRepository.ERROR_MODEL_REQUIRED);
    if (!areaModel) throw new Error(ColheitasRepository.ERROR_MODEL_REQUIRED);
    this.model = model;
    this.areaModel = areaModel;
  }
  async findMediasColheitasAreas(ano: number): Promise<MediaColheita[]> {

    const sql = `
    SELECT 
      SUM(C.KGCOLHIDOS) AS kgcolhidos,
      SUM(C.CACHOS) AS cachos,
      A.AREA AS areas,
      C.MES AS mes
    FROM COLHEITAS C
    INNER JOIN AREAS A ON A.IDAREA = C.IDAREA
    WHERE C.ANO = :ano
    GROUP BY A.AREA, C.MES
    ORDER BY A.AREA ASC, C.MES ASC
  `;

    const resultados = await sequelize.query(sql, {
      replacements: { ano },
      type: QueryTypes.SELECT,
    });

    return resultados as MediaColheita[];

  }


  async findColheitasHectares(ano: number): Promise<ColheitasHectares[]> {
    const resultados = await this.model.findAll({
      attributes: [
        [literal('ROUND(SUM(KGCOLHIDOS)/1000/`Area`.`HECT`, 2)'), 'totalkg'],
        [col('area.AREA'), 'area'],
        'mes',
      ],
      where: { ano },
      include: [
        {
          model: this.areaModel,
          attributes: [],
          required: true,
          as: "area"
        }
      ],
      group: ['area.AREA', 'area.HECT', 'mes'],
      order: [['mes', 'ASC'], [col('area.AREA'), 'ASC']],
      raw: true
    });

    return resultados as unknown as ColheitasHectares[];
  }

  async findByParams(idarea: number, data: Date): Promise<Colheita | null> {
    const record = await this.model.findOne({
      where: { idarea, data }
    });
    return record?.dataValues as Colheita || null;
  }

  async create(colheita: CreateColheitaDto): Promise<Colheita> {
    const { dataValues } = await this.model.create(colheita as any);
    return dataValues as Colheita;
  }

  async list(): Promise<Colheita[]> {
    const records = await this.model.findAll({
      include: [{ model: this.areaModel, as: "area" }],
      order: [["idcolheita", "DESC"]],
      limit: 100
    });
    return records.map((r) => r.dataValues as Colheita);
  }

  async update(idcolheita: number, colheita: Partial<Colheita>): Promise<boolean> {
    const [affectedCount] = await this.model.update(colheita, { where: { idcolheita } });
    return affectedCount > 0;
  }

  async bulkCreate(colheitas: CreateColheitaDto[], transaction: Transaction): Promise<Colheita[]> {
    const records = await this.model.bulkCreate(colheitas as any, { transaction });
    return records.map(r => r.dataValues as Colheita);
  }

  async findDuplicates(dataList: CreateColheitaDto[], transaction: Transaction): Promise<Colheita[]> {
    if (!dataList.length) return [];

    const existing = await this.model.findAll({
      where: {
        [Op.or]: dataList.map(d => ({
          idarea: d.idarea,
          semana: d.semana,
          ano: d.ano
        }))
      },
      transaction
    });

    return existing.map(r => r.dataValues as Colheita);
  }




}
