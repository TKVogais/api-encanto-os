import { PrevisaoColheitaController } from "../controllers/previsaocolheita";
import { PrevisaoColheitaRepository } from "../repositories/previsaocolheita";
import Areas from "../sequelize/models/areas.model";
import CorteCoracoes from "../sequelize/models/cortecoracao.model";
import Fitas from "../sequelize/models/fitas.model";
import PrevisaoColheitas from "../sequelize/models/previsaocolheita.model";
import { PrevisaoColheitaService } from "../services/previsaocolheita.service";
import { paramsAnuaisService } from "./params";
import { resumoColheitaService } from "./resumocolheita";
import { resumoPrevisaoService } from "./resumoprevisao";

const previsaoRepository = new PrevisaoColheitaRepository(PrevisaoColheitas, Areas, Fitas, CorteCoracoes);
export const previsaoService = new PrevisaoColheitaService(previsaoRepository, paramsAnuaisService, resumoColheitaService, resumoPrevisaoService);
export const previsaoController = new PrevisaoColheitaController(previsaoService);
