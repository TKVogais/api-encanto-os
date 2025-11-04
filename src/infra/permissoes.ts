import { PermissoesController } from "../controllers/permissoes";
import { PermissoesRepository } from "../repositories/permissoes";
import Permissao from "../sequelize/models/permissoes.model";
import { PermissoesService } from "../services/permissoes.service";

const permissaoRepository = new PermissoesRepository(Permissao)
const permissaoService = new PermissoesService(permissaoRepository)
export const permissaoController = new PermissoesController(permissaoService)
