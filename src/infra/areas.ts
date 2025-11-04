import { AreasController } from "../controllers/areas";
import { AreasRepository } from "../repositories/areas";
import Areas from "../sequelize/models/areas.model";
import Lotes from "../sequelize/models/lotes.model";
import { AreasService } from "../services/areas.service";

const areasRepository = new AreasRepository(Areas, Lotes);
const areasService = new AreasService(areasRepository);
export const areasController = new AreasController(areasService);
