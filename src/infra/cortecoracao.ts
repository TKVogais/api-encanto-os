import { CorteCoracoesController } from "../controllers/cortecoracao";
import { CorteCoracoesRepository } from "../repositories/cortecoracao";
import CorteCoracoes from "../sequelize/models/cortecoracao.model";
import { CorteCoracoesService } from "../services/cortecoracao.service";
import { inventarioService } from "./inventariocachos";
import { paramsAnuaisService } from "./params";
import { previsaoService } from "./previsaocolheita";
import { resumoPrevisaoService } from "./resumoprevisao";

const corteCoracoesRepository = new CorteCoracoesRepository(CorteCoracoes);
export const corteCoracoesService = new CorteCoracoesService(
    corteCoracoesRepository, 
    previsaoService, 
    resumoPrevisaoService, 
    paramsAnuaisService,
    inventarioService
);
export const corteCoracoesController = new CorteCoracoesController(corteCoracoesService);
