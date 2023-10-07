import { roundTo, toNumber } from "./numbers"
import { NutritionPerHectogram } from '@/types/Food'

export const calculateKjFromMacros = (gramProtein: number, gramFat: number, gramCarbs: number): number => {
    const kcalPerGramProtein = gramProtein * 4
    const kcalPerGramFat = gramFat * 9
    const kcalPerGramCarbs = gramCarbs * 4

    const kjPerKcal = 4.184

    const totalKj = (kcalPerGramProtein + kcalPerGramFat + kcalPerGramCarbs) * kjPerKcal

    return Math.round(totalKj)
}

/**
 * Calculate the nutrient and energy content of a amount of food in grams and kJ, respectively.
 * @param gramsPortion Mass of the food in gram.
 * @param nutritionContentFoodPerHectoGram Macro-nutrient content of the food consumed per 100 grams.
 * @returns Total nutrient and energy content of the portion of food in grams and kJ, respectively.
 */
export const calcNutritionContentFoodPortion = (gramsPortion: number, nutritionContentFoodPerHectoGram: NutritionPerHectogram) => {

    const hectoGramConversionFactor = 0.01
    const roundDecimalPlace = 2

    const macroContentFood: NutritionPerHectogram = {
        gramsProtein: roundTo(gramsPortion * nutritionContentFoodPerHectoGram.gramsProtein * hectoGramConversionFactor, roundDecimalPlace),
        gramsFat: roundTo(gramsPortion * nutritionContentFoodPerHectoGram.gramsFat * hectoGramConversionFactor, roundDecimalPlace),
        gramsCarbs: roundTo(gramsPortion * nutritionContentFoodPerHectoGram.gramsCarbs * hectoGramConversionFactor, roundDecimalPlace),
        kjEnergy: roundTo(gramsPortion * nutritionContentFoodPerHectoGram.kjEnergy * hectoGramConversionFactor, roundDecimalPlace)
    }

    return macroContentFood
}

// ? What is the point of this function?
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

    const foodNutrients = [gramProtein, gramFat, gramCarbs, kjEnergy]

    for (const n of foodNutrients) {
        if (!(Number(n) >= 0)) {
            alert('Please input only a zero or greater for protein, fat, carbs, and energy.')

            return false
        }
    }

    return true
}
