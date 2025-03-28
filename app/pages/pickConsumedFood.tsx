import { StyleSheet, Text } from 'react-native'
import { View } from '@/components/Themed'
import { Stack, useRouter } from 'expo-router'
import { useContext, useEffect, useState } from 'react'
import { DatabaseContext } from '@/database/databaseContext'
import { SQLTransaction } from 'expo-sqlite'
import { convertSqlRows } from '@/database/databaseUtils'
import DynamicTable from '@/components/DynamicTable'
import { Nutrition } from '@/types/Food'
import { ConsumedFoodInput } from '@/components/ConsumedInput'
import { isValidNumberAboveZero } from '@/utils/numbers'

const PickConsumedFood: React.FC = () => {
    const database = useContext(DatabaseContext)

    const [grams, setGrams] = useState<string>('')
    const [idFood, setIdFood] = useState<number>(-1)

    const [rowArray, setRowArray] = useState<string[][]>([])

    const [nutritionContentSelectedFood, setNutritionContentSelectedFood] = useState<Nutrition>({ gramsProtein: 0, gramsFat: 0, gramsCarbs: 0, kjEnergy: 0 })

    const getFood = (tx: SQLTransaction) => {
        tx.executeSql(
            "SELECT * FROM foods ORDER BY id_food DESC",
            [],
            (_, { rows }) => setRowArray(convertSqlRows(rows))
        )
    }

    const handleRowPress = (rowId: number) => {
        setIdFood(rowId)

        database.transaction((tx: SQLTransaction) => {
            tx.executeSql(
                "SELECT protein, fat, carbs, energy FROM foods WHERE id_food = ?",
                [rowId],
                (_, { rows }) => {
                    const row = convertSqlRows(rows)[0].map((n) => Number(n))
                    const [proteinSelectedRow, fatSelectedRow, carbsSelectedRow, kjSelectedRow] = row

                    const nutritionContentRow: Nutrition = {
                        gramsProtein: proteinSelectedRow,
                        gramsFat: fatSelectedRow,
                        gramsCarbs: carbsSelectedRow,
                        kjEnergy: kjSelectedRow
                    }

                    setNutritionContentSelectedFood(nutritionContentRow)
                }
            )
        })
    }

    const onChangeGramsInput = (value: string) => {
        setGrams(value)
    }

    const handlePickButtonPress = () => {
        if (!isValidNumberAboveZero(grams)) {
            alert("Please input a number above zero.")
            return
        } else if (idFood === -1) {
            alert("Select row.")
            return
        }

        database.transaction(
            (tx: SQLTransaction) => {
                tx.executeSql(
                    "INSERT INTO food_consumed (grams_consumed, id_food) VALUES (?, ?)", [
                    grams,
                    idFood
                ])
            }
        )

        useRouter().back()
    }

    useEffect(() => { database.transaction(getFood) }, [])

    const numericCols = [1, 2, 3, 4]
    const primaryKeyCol = 0
    const columnHeader = [
        'Food',
        'Protein',
        'Fat',
        'Carbs',
        'Energy'
    ]

    return (
        <View style={styles.container}>
            <ConsumedFoodInput
                grams={grams}
                onChangeGramsInput={onChangeGramsInput}
                nutritionContentFood={nutritionContentSelectedFood}
                buttonLabel='PICK FOOD'
                onButtonPress={handlePickButtonPress} />
            <DynamicTable
                primaryKeyCol={primaryKeyCol}
                flexColumn={{ columnIndex: primaryKeyCol, flex: 4 }}
                columnsHeader={columnHeader}
                numericCols={numericCols}
                rowArray={rowArray}
                highLightRowOnPress={true}
                onPressRow={handleRowPress} />
            <Stack.Screen options={{ title: "Pick Consumed Food" }} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    nutrientsText: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
})

export default PickConsumedFood
