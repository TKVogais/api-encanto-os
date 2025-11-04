import { AjustesFitasController } from "../controllers/ajustesfitas";
import { AjustesFitasRepository } from "../repositories/ajustesfitas";
import AjustesFitas from "../sequelize/models/ajustesfitas";
import { AjustesFitasService } from "../services/ajustesfitas";
import { inventarioService } from "./inventariocachos";

const ajustesFitasRepository = new AjustesFitasRepository(AjustesFitas);
export const ajustesFitasService = new AjustesFitasService(ajustesFitasRepository,inventarioService);
export const ajustesFitasController = new AjustesFitasController(ajustesFitasService);
