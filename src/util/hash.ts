// src/util/hash.ts

import bcrypt from 'bcrypt';

/**
 * Gera um hash a partir da senha informada
 * @param senha string a ser hasheada
 * @returns hash da senha
 */
export const hash = async (senha: string): Promise<string> => {
  return bcrypt.hashSync(senha, 10);
};

/**
 * Compara uma senha com um hash
 * @param senha string a ser comparada
 * @param hash hash para comparação
 * @returns boolean indicando se é igual
 */
export const compare = async (senha: string, hash: string): Promise<boolean> => {
  return bcrypt.compareSync(senha, hash);
};
