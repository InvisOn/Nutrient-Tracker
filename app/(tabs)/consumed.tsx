import { StyleSheet } from 'react-native'
import { View } from '@/components/Themed'
import { useState, useEffect, useContext, useCallback } from 'react'
import DynamicTable from '@/components/DynamicTable'
import { SQLTransaction } from 'expo-sqlite'
import { useFocusEffect, useRouter } from 'expo-router'
import { DatabaseContext } from '@/database/databaseContext'
import { convertSqlRows } from '@/database/databaseUtils'
import { useForceRender } from '@/utils/forceRender'
import Button from '@/components/Button'

// todo how to design the database that i have 2 tables. 1 with foods, other with consumed_foods.
// store primary key of foods in consumed_foods table. Store date and weight in grams consumed.
// todo consumed tab
// consumed table
// make pick food button
// make consumed table
// make edit consumed foods on press row
// todo make edit consumed page
// also delete button
// todo make pick food page with foods table where to pick food press on row. Long press edit.
// make add new food button
// entire page might as well be a slightly modified FoodTab
const ConsumedTab = () => {
    const database = useContext(DatabaseContext)

    const [forceRenderId, forceRender] = useForceRender()

    const handleAddConsumedButtonPress = () => {
        useRouter().push({
            pathname: '/pages/pickConsumedFood',
        })
    }

    const [rowArray, setRowArray] = useState<string[][]>([])

    const getRowsArrayConsumed = (tx: SQLTransaction) => {
        tx.executeSql(
            `SELECT food_consumed.id_consumed,
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
            // bug why not find editConsumedPage?
            pathname: '/pages/editConsumedPage',
            params: { rowId: rowId }
        })
    }


    // Re-render when a row is edited.
    useFocusEffect(
        useCallback(() => {
            database.transaction(getRowsArrayConsumed)
        }, [])
    )

    // Re-render the when a row is added.
    useEffect(() => { database.transaction(getRowsArrayConsumed) }, [forceRenderId])

    const numericCols = [1, 2, 3, 4, 5]
    const primaryKeyCol = 0
    const columnHeader = [
        'Food',
        'Gram',
        'Protein',
        'Fat',
        'Carbs',
        'Energy'
    ]

    // bug gram column is narrower
    return (
        <View style={styles.container}>
            <Button label='ADD CONSUMED FOOD' onPress={handleAddConsumedButtonPress} />
            <DynamicTable
                key={forceRenderId}
                columnsHeader={columnHeader}
                flexColumn={{ columnIndex: primaryKeyCol, flex: 2 }}
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
