import { findSessionByIP, findSessionByUser, setRedis } from "../api.express/config.redis";
import { AuthDto, ResAutenticateDto, ResAuthDto } from "../DTOs/auth";
import { IAuthService } from "../interfaces/auth";
import { IUsuarioService } from "../interfaces/usuarios";
import { compare } from "../util/hash";
import { gerarToken, tokenPayload, validarToken } from "../util/jwt";
import { Request } from "express";

export class AuthService implements IAuthService {
   static readonly ERROR_SERV = "É necessário fornecer um service de usuário.";

   constructor(private readonly usuarioService: IUsuarioService) {
      if (!usuarioService) throw new Error(AuthService.ERROR_SERV);
   }

   async login(auth: AuthDto, req: Request): Promise<ResAuthDto> {
      const { usuario, senha } = auth;

      try {

         console.log(`[IP]: ${req.ip}`)
         console.log(`[User-Agent]: ${req.headers['user-agent']}`)
         const session = await findSessionByIP(req.ip)

         if (session) {
            return {
               message: "Usuário logado em outro dispositivo!",
               status: 400
            };
         }

         // Busca usuário com permissões
         const foundUser = await this.usuarioService.findByUserWithPermissoes(usuario);

         if (!foundUser) {
            return {
               message: "Os dados fornecidos estão incorretos!",
               status: 400
            };
         }
         console.log(foundUser)

         // Compara a senha
         const senhaCompare = await compare(senha, foundUser.senha);
         if (!senhaCompare) {
            return {
               message: "Um dos dados fornecidos está incorreto!",
               status: 400
            };
         }

         // Gera token JWT
         const token = gerarToken(foundUser.idusuario, foundUser.permissoes);

         // Certifica-se que permissões estão no formato correto
         const permissoes = foundUser.permissoes?.map(p => ({
            idpermissao: p.idpermissao,
            permissao: p.permissao,
            descricao: p.descricao
         })) || [];

         if (permissoes.length === 0 || foundUser.status === "DESATIVADO") {
            return {
               message: "O usuário não possui permissões de acesso ao sistema!",
               status: 500
            };
         }

         await setRedis("sessions", {
            token: token,
            idusuario: foundUser.idusuario,
            permissoes: permissoes,
            autenticaded: true,
            ip: req.ip,
            userAgent: req.headers['user-agent']
         })

         return {
            message: "Login realizado com sucesso!",
            status: 200,
            usuario: { ...foundUser, senha: "" },
            token,
            permissoes: permissoes
         };
      } catch (error) {
         console.error(error);
         return {
            message: "Falha ao realizar o login!",
            status: 500
         };
      }
   }

   async authenticate(token: string): Promise<ResAutenticateDto> {
      const isAuthenticaded = validarToken(token);
      if (!isAuthenticaded) {
         return {
            isAuthenticaded: false,
            permissoes: []
         }
      }
      const payload = await tokenPayload(token)
      return {
         isAuthenticaded: true,
         permissoes: payload.permissoes
      }
   }
}
