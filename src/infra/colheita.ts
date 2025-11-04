import { ColheitasController } from "../controllers/colheita";
import { ColheitasRepository } from "../repositories/colheita";
import Areas from "../sequelize/models/areas.model";
import Colheitas from "../sequelize/models/colheita";
import { ColheitasService } from "../services/colheita";
import { paramsAnuaisService } from "./params";
import { resumoColheitaService } from "./resumocolheita";

const colheitasRepository = new ColheitasRepository(Colheitas, Areas);
const colheitasService = new ColheitasService(colheitasRepository, resumoColheitaService, paramsAnuaisService);
export const colheitasController = new ColheitasController(colheitasService);
