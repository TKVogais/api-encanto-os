import { ResumoPrevisaoController } from "../controllers/resumoprevisao";
import { ResumoPrevisaoRepository } from "../repositories/resumoprevisao";
import CorteCoracoes from "../sequelize/models/cortecoracao.model";
import ResumoPrevisao from "../sequelize/models/resumoprevisao.model";
import { ResumoPrevisaoService } from "../services/resumoprevisao.service";

// Instancia as camadas
const resumoPrevisaoRepository = new ResumoPrevisaoRepository(ResumoPrevisao, CorteCoracoes);
export const resumoPrevisaoService = new ResumoPrevisaoService(resumoPrevisaoRepository);
export const resumoPrevisaoController = new ResumoPrevisaoController(resumoPrevisaoService);
