import { InventarioCachosController } from "../controllers/inventariocachos";
import { InventarioCachosRepository } from "../repositories/inventariocachos";
import InventarioCachosModel from "../sequelize/models/inventariocachos";
import { InventarioCachosService } from "../services/inventariocachos.service";
import { paramsAnuaisService } from "./params";

const inventarioRepository = new InventarioCachosRepository(InventarioCachosModel);
export const inventarioService = new InventarioCachosService(inventarioRepository, paramsAnuaisService);
export const inventarioController = new InventarioCachosController(inventarioService);
