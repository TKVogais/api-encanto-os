import moment from "moment";

export interface ParamsWeek {
    semanaInicial: number,
    semanaFinal: number
    anoInicial: number
    anoFinal: number
}

export const GenBetweenWeekParams = (mode = "prev"): ParamsWeek => {
    const hoje = moment();

    const semanaInicial = hoje.subtract(mode === "prev" ? 3 : 2, "weeks").isoWeek()
    const anoInicial = hoje.year()
    const semanaFinal = hoje.add(15, "weeks").isoWeek();
    const anoFinal = hoje.add(15, "weeks").year()

    return {
        semanaInicial,
        semanaFinal,
        anoInicial,
        anoFinal
    }
}