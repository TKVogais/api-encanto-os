// infra/mediasareas.ts
import { MediasAreasController } from "../controllers/mediasareas"
import { MediasAreasRepository } from "../repositories/mediasareas"
import MediasAreas from "../sequelize/models/mediaarea.model"
import { MediasAreasService } from "../services/mediasareas.service"

const mediasAreasRepository = new MediasAreasRepository(MediasAreas)
const mediasAreasService = new MediasAreasService(mediasAreasRepository)
export const mediasAreasController = new MediasAreasController(mediasAreasService)
