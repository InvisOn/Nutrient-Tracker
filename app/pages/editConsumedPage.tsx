import { StyleSheet } from 'react-native'
import { View } from '@/components/Themed'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useContext, useEffect, useState } from 'react'
import { DatabaseContext } from '@/database/databaseContext'
import { SQLTransaction } from 'expo-sqlite'
import Button from '@/components/Button'
import { Nutrition } from '@/types/Food'
import { ConsumedFoodInput } from '@/components/ConsumedInput'
import { convertSqlRows } from '@/database/databaseUtils'
import { isValidNumberAboveZero } from '@/utils/numbers'

// ? should I add this page to app/_layout.tsx?
const EditConsumedPage: React.FC = () => {
    const params = useLocalSearchParams()
    const database = useContext(DatabaseContext)
    const idConsumed = String(params.rowId)

    const [gramsConsumed, setGramsConsumed] = useState('')
    const [nutritionConsumedFoodPerHectogram, setNutritionConsumedFoodPerHectogram] = useState<Nutrition>({ gramsProtein: 0, gramsFat: 0, gramsCarbs: 0, kjEnergy: 0 })

    const getConsumedFood = (tx: SQLTransaction) => {
        tx.executeSql(
            `SELECT food_consumed.grams_consumed,
                    foods.protein,
                    foods.fat,
                    foods.carbs,
                    foods.energy
            FROM food_consumed
            JOIN foods ON food_consumed.id_food = foods.id_food
            WHERE food_consumed.id_consumed = ?;`,
            [idConsumed],
            (_, { rows }) => {
                const row = convertSqlRows(rows)[0].map((n) => Number(n))
                const [gramsConsumedFromDb, gramsProteinPerHectogram, gramsFatPerHectogram, gramsCarbsCPerHectogram, kjEnergyPerHectogram] = row

                const nutritionConsumedFood: Nutrition = {
                    gramsProtein: gramsProteinPerHectogram,
                    gramsFat: gramsFatPerHectogram,
                    gramsCarbs: gramsCarbsCPerHectogram,
                    kjEnergy: kjEnergyPerHectogram
                }

                setGramsConsumed(String(gramsConsumedFromDb))
                setNutritionConsumedFoodPerHectogram(nutritionConsumedFood)
            }
        )
    }

    useEffect(() => {
        database.transaction(getConsumedFood)
    }, [])

    const onChangeGramsInput = (value: string) => {
        setGramsConsumed(value)
    }

    const onEditButtonPress = () => {
        if (!isValidNumberAboveZero(gramsConsumed)) {
            alert("Please input a number above zero.")

            return
        }

        database.transaction(
            (tx: SQLTransaction) => {
                tx.executeSql(
                    "UPDATE food_consumed SET grams_consumed = ? WHERE id_consumed = ?",
                    [gramsConsumed, idConsumed]
                )
            }
        )

        useRouter().back()
    }

    const onDeleteButtonPress = () => {
        database.transaction(
            (tx: SQLTransaction) => {
                tx.executeSql(
                    "DELETE FROM food_consumed WHERE id_consumed = ?",
                    [idConsumed]
                )
            }
        )

        useRouter().back()
    }

    return (
        <View style={styles.container}>
            <ConsumedFoodInput
                grams={gramsConsumed}
                onChangeGramsInput={onChangeGramsInput}
                nutritionContentFood={nutritionConsumedFoodPerHectogram}
                buttonLabel='EDIT CONSUMED'
                onButtonPress={onEditButtonPress} />
            <Button label='DELETE CONSUMED' onPress={onDeleteButtonPress} />
            <Stack.Screen options={{ title: "Edit Consumed" }} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10
    }
})

export default EditConsumedPage
