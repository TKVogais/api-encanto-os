import ApiExpress from "./api.express/api.express";
import { controllers } from "./api.express/list.controllers";
import 'dotenv/config';

const main = () => {
    const PORT = Number(process.env.PORT) || 4000
    const HOST = process.env.HOSTAPI || "127.0.0.0"
    const apiExpress = ApiExpress.build();
    apiExpress.buildControllers(controllers);
    apiExpress.start(PORT, HOST);
};
main();
