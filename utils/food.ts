export const toNumber = (value: string | number): number => {
    const num = Number(value)

    return Number.isNaN(num) ? 0 : num
}

export const isReal = (value: string | number) => !Number.isNaN(Number(value) && Number(value) <= 0)

export const calculateKjFromMacros = (gramProtein: number, gramFat: number, gramCarbs: number): number => {
    const kcalPerGramProtein = gramProtein * 4
    const kcalPerGramFat = gramFat * 9
    const kcalPerGramCarbs = gramCarbs * 4

    const kjPerKcal = 4.184

    const totalKj = (kcalPerGramProtein + kcalPerGramFat + kcalPerGramCarbs) * kjPerKcal

    return Math.round(totalKj)
}
