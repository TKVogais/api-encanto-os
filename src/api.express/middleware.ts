import { Request, Response, NextFunction } from "express";
import { validarToken } from "../util/jwt";
import { findSessionByToken } from "./config.redis";

export async function requireToken(req: Request, res: Response, next: NextFunction) {
  try {
    let token: string | undefined;

    // 1️⃣ Tenta pegar o token pelo header Authorization
    const authHeader = req.headers["authorization"];
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2️⃣ Se não veio pelo header, tenta pegar pelo cookie HttpOnly
    if (!token && req.cookies?.authToken) {
      token = req.cookies.authToken;
    }

    if (!token) {
      return res.status(401).json({ message: "Token não fornecido" });
    }

    // 3️⃣ Valida o token JWT primeiro
    const payload = validarToken(token);
    if (!payload) {
      return res.status(401).json({ message: "Token inválido ou expirado" });
    }

    // 4️⃣ Busca a sessão no Redis (garante que o token ainda está ativo)
    const session = await findSessionByToken(token);
    if (!session) {
      return res.status(401).json({ message: "Sessão expirada ou inexistente" });
    }
    const payloadSession = validarToken(session.token);
    if (!payloadSession) {
      return res.status(401).json({ message: "Token inválido ou expirado" });
    }

    // 6️⃣ Tudo certo → injeta o payload no request
    (req as any).user = payload;
    next();
  } catch (err) {
    console.error("Erro em requireToken:", err);
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
}
