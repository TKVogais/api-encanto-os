import { LotesController } from "../controllers/lote"
import { LotesRepository } from "../repositories/lotes"
import Lotes from "../sequelize/models/lotes.model"
import { LotesService } from "../services/lotes.service"

const lotesRepository = new LotesRepository(Lotes)
const lotesService = new LotesService(lotesRepository)
export const lotesController = new LotesController(lotesService)
