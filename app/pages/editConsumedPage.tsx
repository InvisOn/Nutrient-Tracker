import { StyleSheet } from 'react-native'
import { View } from '@/components/Themed'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useContext, useEffect, useState } from 'react'
import { DatabaseContext } from '@/database/databaseContext'
import { SQLTransaction } from 'expo-sqlite'
import Button from '@/components/Button'
import { Food } from '@/types/Food'

// ? should I add this page to app/_layout.tsx?
export const EditConsumedPage: React.FC = () => {
    const params = useLocalSearchParams()
    const database = useContext(DatabaseContext)
    const rowId = String(params.rowId)

    const [idConsumed, setIdConsumed] = useState<number>(-1)
    const [idFood, setIdFood] = useState<number>(-1)
    const [gramsConsumed, setGramsConsumed] = useState<number>(-1)

    const [nutrientContentSelectedFood, setNutrientContentSelectedFood] = useState<Food>({ gramsProtein: 0, gramsFat: 0, gramsCarbs: 0, kjEnergy: 0 })

    const [gramsConsumedNutrientContentSelectedFood, setGramsConsumedNutrientContentSelectedFood] = useState<Food>({ gramsProtein: 0, gramsFat: 0, gramsCarbs: 0, kjEnergy: 0 })

    const getConsumedFood = (tx: SQLTransaction) => {
        tx.executeSql(
            "SELECT id_consumed, id_food, grams_consumed FROM foods WHERE id_food = ?",
            [rowId],
            (_, { rows }) => {
                const row = rows.item(0)

                setIdConsumed(row["id_consumed"])
                setIdFood(row["id_food"])
                setGramsConsumed(row["grams_consumed"])
            }
        )
    }

    useEffect(() => { database.transaction(getConsumedFood) }, [])

    const onEditButtonPress = () => {

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
                    "DELETE FROM foods WHERE id_food = ?",
                    [rowId]
                )
            }
        )

        useRouter().back()
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: "Edit Consumed" }} />
            {/* <InputFood
                valueProductName={idConsumed}
                valueGramProtein={gramProtein}
                valueGramFat={gramFat}
                valueGramCarbs={gramCarbs}
                valueKjEnergy={kjEnergy}
                onChangeTextProductName={setProductName}
                onChangeTextGramProtein={setProtein}
                onChangeTextGramFat={setFat}
                onChangeTextGramCarbs={setCarbs}
                onChangeTextKjEnergy={setKjEnergy}
                buttonLabel={'EDIT INGREDIENT'}
                onButtonPress={onEditButtonPress}
            /> */}
            <Button label='DELETE FOOD' onPress={onDeleteButtonPress} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10
    }
})
