import Redis from "ioredis";
import { Permissao } from "../entities/permissao";

const redisClient = new Redis();

export interface Session {
    token: string;
    idusuario: number;
    permissoes: Permissao[];
    autenticaded: boolean
}

export const getRedis = async <T = any>(key: string): Promise<T | null> => {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) as T : null;
};

export const setRedis = async (key: string, session: Session): Promise<void> => {
    const sessions = (await getRedis<Session[]>(key)) || [];
    const index = sessions.findIndex(s => s.idusuario === session.idusuario);
    if (index >= 0) {
        sessions[index] = session;
    } else {
        sessions.push(session);
    }
    await redisClient.set(key, JSON.stringify(sessions));
};

export const findSessionByUser = async (idusuario: number): Promise<Session | null> => {
    const sessions = await getRedis<Session[]>("sessions");
    if (!sessions) return null;
    return sessions.find(s => s.idusuario === idusuario) || null;
};

export const findSessionByToken = async (token: string): Promise<Session | null> => {
    const sessions = await getRedis<Session[]>("sessions");
    if (!sessions) return null;
    return sessions.find(s => s.token === token) || null;
};

export const deleteSession = async (idusuario: number): Promise<void> => {
    const sessions = (await getRedis<Session[]>("sessions")) || [];
    const filtered = sessions.filter(s => s.idusuario !== idusuario);
    await redisClient.set("sessions", JSON.stringify(filtered));
};

export { redisClient };
