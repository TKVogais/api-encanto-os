import { UsuarioController } from "../controllers/usuarios";
import { UsuarioRepository } from "../repositories/usuarios";
import Permissao from "../sequelize/models/permissoes.model";
import UsuarioPermissao from "../sequelize/models/permissoes.usuarios.model";
import Pessoa from "../sequelize/models/pessoas.model";
import Usuario from "../sequelize/models/usuarios.model";
import { UsuarioService } from "../services/usuarios.service";
import { pessoaService } from "./pessoas";

const usuarioRepository = new UsuarioRepository(Usuario, Permissao, Pessoa, UsuarioPermissao)
export const usuarioService = new UsuarioService(usuarioRepository, pessoaService)
export const usuarioController = new UsuarioController(usuarioService)

