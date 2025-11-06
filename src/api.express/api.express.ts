import express, { Express, RequestHandler } from "express";
import cors from "cors";
import 'dotenv/config';

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
    const allowedOrigins = JSON.parse(process.env.CORS_ORIGINS || "[]") 

    // ✅ Configuração CORS segura
    app.use(cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          console.warn(`❌ Origem não permitida pelo CORS: ${origin}`);
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true, // necessário para cookies, sessions, etc.
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "x-user-permissions"]
    }));

    // ✅ Responde automaticamente requisições preflight
    app.options("*", cors());

    // ✅ Body parsers
    app.use(express.json({ limit: "50mb" }));
    app.use(express.urlencoded({ limit: "50mb", extended: true }));

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
        console.warn(`⚠️ Método HTTP desconhecido: ${route.method}`);
      }
    });
  }

  start(port: number = 4000, host: string = "0.0.0.0"): void {
    this.app.listen(port, host, () => {
      console.log(`🚀 Servidor rodando em http://${host}:${port}`);
      this.printRoutes();
    });
  }

  private printRoutes(): void {
    const routes = (this.app as any)._router.stack
      .filter((r: any) => r.route)
      .map((r: any) => ({
        path: r.route.path,
        method: r.route.stack[0].method
      }));

    console.log("📜 Rotas configuradas:", routes);
  }
}
