import { Request, Response } from "express";
import { IAuthController, IAuthService } from "../interfaces/auth";
import Controller, { ControllerMiddlewares } from "../util/controller";
import { AuthDto } from "../DTOs/auth";
import { setRedis } from "../api.express/config.redis";

export class AuthController extends Controller implements IAuthController {

    constructor(
        private readonly authService: IAuthService,
        middlewares: ControllerMiddlewares = {}
    ) {
        super(middlewares)
    }

    async pLogout(req: Request, res: Response): Promise<void> {
        res.clearCookie("authToken", { path: "/", httpOnly: true, secure: true, sameSite: "strict" });
        res.status(200).json({ message: "Logout realizado" });
    }

    async pLogin(req: Request, res: Response): Promise<void> {
        const { usuario, senha } = req.body;
        const authDto: AuthDto = { usuario, senha };

        // Chama o service de login
        const result = await this.authService.login(authDto);

        // Se login foi bem-sucedido, seta o cookie HttpOnly
        if (result.status === 200 && result.token) {
            res.cookie('authToken', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // HTTPS em produção
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24, // 1 dia
            });
        }


        res.json(result);
    }

    async gAutenticate(req: Request, res: Response): Promise<void> {
        try {
            let token: string | undefined;

            // 1️⃣ Verifica header Authorization
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith("Bearer ")) {
                token = authHeader.split(" ")[1];
            }
            // 2️⃣ Se não veio pelo header, verifica cookie HttpOnly
            if (!token && req.cookies?.authToken) {
                token = req.cookies.authToken;
            }
            if (!token) {
                res.status(401).json({ message: "Token não fornecido ou inválido" });
                return;
            }

            // 4️⃣ Chama o serviço de autenticação
            const result = await this.authService.authenticate(token);

           
            res.json(result);
        } catch (err) {
            console.error("Erro em gAutenticate:", err);
            res.status(500).json({ message: "Erro interno" });
        }
    }


}