import moment from "moment";

export interface ParamsPrev {
    mesInicial: number,
    mesFinal: number
    anoInicial: number
    anoFinal: number
}

export const GenBetweenPrevParams = (logger = false): ParamsPrev => {
    //Inicializa com data de "hoje"
    const hoje = moment();
    if(logger) console.log(`Data Atual: ${hoje.toLocaleString()}`)
    //Determina a data final do mês da data de hoje
    const datafinal = hoje.clone().add(4, "months").endOf("month");
    if(logger) console.log(`Data Final: ${datafinal.toLocaleString()}`)
    //Determina a data inicial retornando 12 meses
    const datainicial = datafinal.clone().subtract(11, "months").startOf("month");
    if(logger) console.log(`Data Inicial: ${datainicial.toLocaleString()}`)
    //Determina o mês da data final (+1 para que pegue sempre um intervalo)
    //(9-10, 8-9)
    const mesFinal = datafinal.month()
    if(logger) console.log(`Mês Final: ${mesFinal}`)
    //Determina o ano da data final
    const anoFinal = datafinal.year()
    if(logger) console.log(`Ano Final: ${anoFinal}`)
    //Determina o mês da data inicial
    const mesInicial = datainicial.month()
    if(logger) console.log(`Mês Inicial: ${mesInicial}`)
    //Determina o ano da data inicial
    const anoInicial = datainicial.year()
    if(logger) console.log(`Ano Inicial: ${anoInicial}`)
    //retorno da função
    return {
        mesFinal,
        mesInicial,
        anoFinal,
        anoInicial
    }
}