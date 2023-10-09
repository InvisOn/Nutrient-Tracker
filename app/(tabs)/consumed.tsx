import { StyleSheet } from 'react-native'
import { View } from '@/components/Themed'
import { useState, useEffect, useContext, useCallback } from 'react'
import DynamicTable from '@/components/DynamicTable'
import { SQLTransaction } from 'expo-sqlite'
import { useFocusEffect, useRouter } from 'expo-router'
import { DatabaseContext } from '@/database/databaseContext'
import { convertSqlRows } from '@/database/databaseUtils'
import Button from '@/components/Button'

const ConsumedTab = () => {
    const database = useContext(DatabaseContext)

    const handleAddConsumedButtonPress = () => {
        useRouter().push({
            pathname: '/pages/pickConsumedFood',
        })
    }

    const [rowArray, setRowArray] = useState<string[][]>([])

    const getRowsArrayConsumed = (tx: SQLTransaction) => {
        tx.executeSql(
            `SELECT food_consumed.id_consumed,
                    substr(strftime('%Y-%m-%d', food_consumed.date_consumed), 3),
                    strftime('%H:%M', food_consumed.time_consumed),
                    foods.name,
                    food_consumed.grams_consumed,
                    ROUND(food_consumed.grams_consumed * foods.protein * 0.01, 2) AS total_protein,
                    ROUND(food_consumed.grams_consumed * foods.fat * 0.01, 2)  AS total_fat,
                    ROUND(food_consumed.grams_consumed * foods.carbs * 0.01, 2)  AS total_carbs,
                    ROUND(food_consumed.grams_consumed * foods.energy * 0.01, 2)  AS total_energy
            FROM food_consumed
            JOIN foods
                ON food_consumed.id_food = foods.id_food
            ORDER BY food_consumed.id_consumed DESC;`,
            [],
            (_, { rows }) => setRowArray(convertSqlRows(rows))
        )
    }

    const handlePressRow = (rowId: number) => {
        useRouter().push({
            pathname: '/pages/editConsumedPage',
            params: { rowId: rowId }
        })
    }

    // Re-render when a row is edited or added.
    useFocusEffect(
        useCallback(() => {
            database.transaction(getRowsArrayConsumed)
        }, [])
    )

    // Re-render the when a row is added.
    useEffect(() => { database.transaction(getRowsArrayConsumed) }, [])

    const numericCols = [3, 4, 5, 6, 7, 8]
    const primaryKeyCol = 0
    const columnHeader = [
        'Date',
        'Time',
        'Food',
        'Gram',
        'Protein',
        'Fat',
        'Carbs',
        'Energy'
    ]

    return (
        <View style={styles.container}>
            <Button label='ADD CONSUMED FOOD' onPress={handleAddConsumedButtonPress} />
            <DynamicTable
                columnsHeader={columnHeader}
                numericCols={numericCols}
                primaryKeyCol={primaryKeyCol}
                onPressRow={handlePressRow}
                highLightRowOnPress={false}
                rowArray={rowArray}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})

export default ConsumedTab
