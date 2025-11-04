// src/controllers/controller.controller.ts
import { RequestHandler } from "express";

// 🔹 Tipo para cada rota
export interface RouteDefinition {
  method: "get" | "post" | "put" | "delete";
  path: string;
  controller: RequestHandler;
  middlewares?: RequestHandler[]; // ✅ agora podemos passar middlewares
}

export interface ControllerMiddlewares {
  [methodName: string]: RequestHandler[]; // chave = nome do método
}

export default abstract class Controller {

  middlewares: ControllerMiddlewares;

  constructor(middlewares: ControllerMiddlewares = {}) {
    this.middlewares = middlewares; // middlewares via construtor
  }

  /**
   * Gera as rotas automaticamente a partir dos métodos do controller
   */
  generateRoutes(): RouteDefinition[] {
    const className = this.constructor.name.replace(/Controller$/, "");

    // 🔹 Mantém o nome todo em minúsculo, sem underscores mesmo se houver CamelCase
    let pathBase = className.toLowerCase();

    // 🔹 Garante pluralização simples (se não termina com "s")
    if (!pathBase.endsWith("s")) pathBase += "s";

    const methodMap: Record<string, "get" | "post" | "put" | "delete"> = {
      p: "post",
      g: "get",
      u: "put",
      d: "delete",
    };

    return Object.getOwnPropertyNames(Object.getPrototypeOf(this))
      .filter((methodName) => methodName !== "constructor")
      .map((methodName) => {
        const prefix = methodName.charAt(0).toLowerCase();
        const httpMethod = methodMap[prefix];

        if (!httpMethod) {
          throw new Error(`Método desconhecido: ${methodName}`);
        }

        // 🔹 Caminho base + método sem prefixo, ambos minúsculos
        const path = `/${pathBase}/${methodName.slice(1).toLowerCase()}`;

        // ✅ Middlewares registrados no construtor
        const middlewares = this.middlewares[methodName] || [];

        return {
          path,
          method: httpMethod,
          controller: (this as any)[methodName].bind(this),
          middlewares,
        };
      });
  }

}
