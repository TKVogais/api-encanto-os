import { BancoController } from "../controllers/banco"
import { BancosRepository } from "../repositories/bancos"
import Banco from "../sequelize/models/bancos.model"
import { BancoService } from "../services/bancos.service"

const bancosRepository = new BancosRepository(Banco)
const bancosService = new BancoService(bancosRepository)
export const bancosController = new BancoController(bancosService)
