import express, { Express, RequestHandler } from "express";
import cors from "cors";

// 🔹 Tipos para rotas
export interface RouteDefinition {
  method: "get" | "post" | "put" | "delete";
  path: string;
  controller: RequestHandler;
  middlewares?: RequestHandler[];
}

// 🔹 Tipo esperado de um controller
export interface ControllerClass {
  constructor: {
    generateRoutes(): RouteDefinition[];
  };
}

export default class ApiExpress {
  private app: Express;

  constructor(app: Express) {
    this.app = app;
  }

  static build(): ApiExpress {
    const app = express();

    // ✅ Configuração CORS para aceitar cookies HttpOnly do front-end
    app.use(cors({
      origin: "*",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "x-user-permissions"]
    }));

    // ✅ Responde preflight OPTIONS
    app.options("*", cors());
    app.use(express.json({ limit: "50mb" }));
    app.use(express.urlencoded({ limit: "50mb", extended: true }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    return new ApiExpress(app);
  }

  buildControllers(controllers: any[] = []): void {
    controllers.forEach((controller) => {
      if (controller.generateRoutes) {
        const routes = controller.generateRoutes();
        this.buildRoutes(routes);
      }
    });
  }

  private routeMethods: Record<string, keyof Express> = {
    get: "get",
    post: "post",
    put: "put",
    delete: "delete"
  };

  private buildRoutes(routes: RouteDefinition[]): void {
    routes.forEach((route) => {
      const method = this.routeMethods[route.method.toLowerCase()];
      if (method) {
        const handlers = [...(route.middlewares || []), route.controller];
        (this.app[method] as any)(route.path, ...handlers);
      } else {
        console.warn(`Método HTTP desconhecido: ${route.method}`);
      }
    });
  }

  start(port: number = 4000, host: string = "0.0.0.0"): void {
    if (host) {
      this.app.listen(port, host, () => {
        console.log(`Servidor rodando na porta ${port} e no host ${host}`);
        this.printRoutes();
      });
    } else {
      this.app.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`);
        this.printRoutes();
      });
    }
  }


  private printRoutes(): void {
    const routes = (this.app as any)._router.stack
      .filter((r: any) => r.route)
      .map((r: any) => ({
        path: r.route.path,
        method: r.route.stack[0].method
      }));

    console.log("Rotas configuradas:", routes);
  }
}
