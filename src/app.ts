import ApiExpress from "./api.express/api.express";
import { controllers } from "./api.express/list.controllers";

const main = () => {
    const apiExpress = ApiExpress.build();
    apiExpress.buildControllers(controllers);
    apiExpress.start();
};
main();
