// src/infra/fitas.ts
import { FitasController } from "../controllers/fitas";
import { FitasRepository } from "../repositories/fitas";
import Fitas from "../sequelize/models/fitas.model";
import { FitasService } from "../services/fitas.service";

const fitasRepository = new FitasRepository(Fitas);
const fitasService = new FitasService(fitasRepository);
export const fitasController = new FitasController(fitasService);
