import { requireToken } from "../api.express/middleware";
import { AuthController } from "../controllers/auth";
import { AuthService } from "../services/auth.service";
import { usuarioService } from "./usuarios";

const authService = new AuthService(usuarioService);

// ✅ Passando middleware via construtor
export const authController = new AuthController(authService, {
  pAutenticate: [requireToken] // apenas a rota de autenticação precisa do token
});
