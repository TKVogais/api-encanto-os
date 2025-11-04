import { ResumoColheitaController } from "../controllers/resumocolheita";
import { ResumoColheitaRepository } from "../repositories/resumocolheita";
import ResumoColheitaModel from "../sequelize/models/resumocolheita";
import { ResumoColheitaService } from "../services/resumocolheita.service";

const resumoColheitaRepository = new ResumoColheitaRepository(ResumoColheitaModel);
export const resumoColheitaService = new ResumoColheitaService(resumoColheitaRepository);
export const resumoColheitaController = new ResumoColheitaController(resumoColheitaService);
