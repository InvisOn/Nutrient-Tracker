export type NutrientsPerHectogram = {
    gramsProtein: number
    gramsFat: number
    gramsCarbs: number
}

export type KjEnergy = {
    kjEnergy: number
}

export type NutritionPerHectogram = NutrientsPerHectogram & KjEnergy

export type Food = { name: string } & NutritionPerHectogram