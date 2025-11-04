// src/util/jwt.ts

import dotenv from 'dotenv';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Permissao } from '../entities/permissao';

dotenv.config();

const SECRET_KEY = process.env.NODE_JWT_KEY;
if (!SECRET_KEY) {
  throw new Error('JWT secret key não definida em .env');
}

// Interface do payload do token
interface TokenPayload {
  idUsuario: number;
  [key: string]: any; // permite adicionar campos extras
}

/**
 * Gera um token JWT com o id do usuário
 * @param idUsuario id do usuário
 * @returns token JWT
 */
export const gerarToken = (idUsuario: number, permissoes: Permissao[]): string => {
  const payload: TokenPayload = { idUsuario, permissoes };
  const options = { expiresIn: 40 * 60 * 12 }; // 40 minutos
  return jwt.sign(payload, SECRET_KEY, options);
};

/**
 * Valida um token JWT
 * @param token token JWT
 * @returns true se válido, false se inválido
 */

export const validarToken = (token: string): boolean => {
  try {
    jwt.verify(token, SECRET_KEY);
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * Retorna o payload do token
 * @param token token JWT
 * @returns payload do token ou erro
 */
export const tokenPayload = async (token: string): Promise<TokenPayloadDto> => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload & {
      idusuario: number;
      permissoes: Permissao[];
    };

    return {
      error: false,
      message: 'Token válido',
      idusuario: decoded.idusuario,
      permissoes: decoded.permissoes || [],
    };
  } catch (err) {
    return {
      error: true,
      message: 'Token inválido ou expirado',
      idusuario: 0,
      permissoes: [],
    };
  }
};

export interface TokenPayloadDto {
  error: boolean
  message: string
  idusuario: number
  permissoes: Permissao[]
} 