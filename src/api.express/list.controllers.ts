import { ajustesFitasController } from "../infra/ajustesfitas";
import { areasController } from "../infra/areas";
import { authController } from "../infra/auth";
import { bancosController } from "../infra/banco";
import { colheitasController } from "../infra/colheita";
import { corteCoracoesController } from "../infra/cortecoracao";
import { fitasController } from "../infra/fitas";
import { healthController } from "../infra/health";
import { inventarioController } from "../infra/inventariocachos";
import { lotesController } from "../infra/lote";
import { mediasAreasController } from "../infra/mediasareas";
import { permissaoController } from "../infra/permissoes";
import { pessoaController } from "../infra/pessoas";
import { previsaoController } from "../infra/previsaocolheita";
import { resumoColheitaController } from "../infra/resumocolheita";
import { resumoPrevisaoController } from "../infra/resumoprevisao";
import { usuarioController } from "../infra/usuarios";

export const controllers = [
    pessoaController,
    usuarioController,
    authController,
    permissaoController,
    bancosController,
    lotesController,
    areasController,
    fitasController,
    mediasAreasController,
    corteCoracoesController,
    previsaoController,
    resumoPrevisaoController,
    colheitasController, 
    resumoColheitaController, 
    inventarioController,
    ajustesFitasController,
    healthController
]