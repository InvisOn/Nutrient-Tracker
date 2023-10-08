export type Nutrients = {
    gramsProtein: number
    gramsFat: number
    gramsCarbs: number
}

export type KjEnergy = {
    kjEnergy: number
}

export type Nutrition = Nutrients & KjEnergy

export type Food = { name: string } & Nutrition
