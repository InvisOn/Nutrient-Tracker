import { isReal, toNumber } from "./numbers"

export const calculateKjFromMacros = (gramProtein: number, gramFat: number, gramCarbs: number): number => {
    const kcalPerGramProtein = gramProtein * 4
    const kcalPerGramFat = gramFat * 9
    const kcalPerGramCarbs = gramCarbs * 4

    const kjPerKcal = 4.184

    const totalKj = (kcalPerGramProtein + kcalPerGramFat + kcalPerGramCarbs) * kjPerKcal

    return Math.round(totalKj)
}

export const convertFood = (gramProtein: string | number, gramFat: string | number, gramCarbs: string | number, kjEnergy: string | number) => {

    const gramProteinNumber = Number(gramProtein)
    const gramFatNumber = Number(gramFat)
    const gramCarbsNumber = Number(gramCarbs)

    let kjEnergyNumber = toNumber(kjEnergy)

    kjEnergyNumber = kjEnergyNumber === 0 ? calculateKjFromMacros(gramProteinNumber, gramFatNumber, gramCarbsNumber) : kjEnergyNumber

    return [gramProteinNumber, gramFatNumber, gramCarbsNumber, kjEnergyNumber]
}

export const validateFood = (productName: string, gramProtein: string | number, gramFat: string | number, gramCarbs: string | number, kjEnergy: string | number) => {
    if (productName === '' || productName === null) {
        alert("Please type an ingredient name.")

        return false
    }

    if (!isReal(gramProtein) || !isReal(gramFat) || !isReal(gramCarbs) || !isReal(kjEnergy)) {
        alert('Please input only numbers for protein, fat, carbs, and energy.')

        return false
    }

    return true
}
