import { ParamsAnuaisController } from "../controllers/params";
import { ParamsAnuaisRepository } from "../repositories/params";
import ParamsAnuais from "../sequelize/models/params.model";
import { ParamsAnuaisService } from "../services/params.service";

const paramsAnuaisRepository = new ParamsAnuaisRepository(ParamsAnuais);
export const paramsAnuaisService = new ParamsAnuaisService(paramsAnuaisRepository);
export const paramsAnuaisController = new ParamsAnuaisController(paramsAnuaisService);
