import { PessoaController } from "../controllers/pessoas";
import { PessoaRepository } from "../repositories/pessoas";
import Pessoa from "../sequelize/models/pessoas.model";
import { PessoasService } from "../services/pessoas.service";

const pessoaRepository = new PessoaRepository(Pessoa)
export const pessoaService = new PessoasService(pessoaRepository)
export const pessoaController = new PessoaController(pessoaService)
