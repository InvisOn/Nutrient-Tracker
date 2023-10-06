import { StyleSheet } from 'react-native'
import { View } from '@/components/Themed'
import { useState, useEffect, useContext, useCallback } from 'react'
import DynamicTable from '@/components/DynamicTable'
import { SQLTransaction } from 'expo-sqlite'
import { InputFood } from '@/components/InputFood'
import { useFocusEffect, useRouter } from 'expo-router'
import { DatabaseContext } from '@/database/databaseContext'
import { convertSqlRows } from '@/database/databaseUtils'
import { useForceRender } from '@/utils/forceUpdate'
import { convertFood, validateFood } from '@/utils/food'

const FoodTab = () => {
    const database = useContext(DatabaseContext)

    const [productName, setProductName] = useState<string>('')

    // <string | number> instead of <number> to simplify placeholder value logic for InputFood.
    const [gramProtein, setProtein] = useState<string | number>('')
    const [gramFat, setFat] = useState<string | number>('')
    const [gramCarbs, setCarbs] = useState<string | number>('')
    const [kjEnergy, setEnergy] = useState<string | number>('')

    const [forceRenderId, forceRender] = useForceRender()

    const handleButtonPress = () => {
        if (!validateFood(productName, gramProtein, gramFat, gramCarbs, kjEnergy)) {
            return false
        }

        const [gramProteinNumber, gramFatNumber, gramCarbsNumber, kjEnergyNumber] = convertFood(gramProtein, gramFat, gramCarbs, kjEnergy)

        database.transaction(
            (tx: SQLTransaction) => {
                tx.executeSql("INSERT INTO foods (name, protein, fat, carbs, energy) VALUES (?, ?, ?, ?, ?)", [
                    productName,
                    gramProteinNumber,
                    gramFatNumber,
                    gramCarbsNumber,
                    kjEnergyNumber,
                ])
            },
            undefined,
            forceRender
        )

        setProductName('')
        setProtein('')
        setFat('')
        setCarbs('')
        setEnergy('')
    }

    const [rowArray, setRowArray] = useState<string[][]>([])

    const getRowsArrayFood = (tx: SQLTransaction) => {
        tx.executeSql(
            "SELECT * FROM foods ORDER BY id_food DESC",
            [],
            (_, { rows }) => setRowArray(convertSqlRows(rows))
        )
    }

    const handlePressRow = (idFood: number) => {
        useRouter().push({
            pathname: '/pages/editFoodPage',
            params: { idFood: idFood }
        })
    }


    // Re-render when a food is edited.
    useFocusEffect(
        useCallback(() => {
            database.transaction(getRowsArrayFood)
        }, [])
    )

    // Re-render the when a food is added.
    useEffect(() => { database.transaction(getRowsArrayFood) }, [forceRenderId])

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
            <InputFood
                valueProductName={productName}
                valueGramProtein={gramProtein}
                valueGramFat={gramFat}
                valueGramCarbs={gramCarbs}
                valueKjEnergy={kjEnergy}
                onChangeTextProductName={setProductName}
                onChangeTextGramProtein={setProtein}
                onChangeTextGramFat={setFat}
                onChangeTextGramCarbs={setCarbs}
                onChangeTextKjEnergy={setEnergy}
                buttonLabel={'ADD FOOD'}
                onButtonPress={handleButtonPress}
            />
            <DynamicTable
                key={forceRenderId}
                columnsHeader={columnHeader}
                flexColumn={{ columnIndex: 0, flex: 4 }}
                numericCols={numericCols}
                primaryKeyCol={primaryKeyCol}
                onPressRow={handlePressRow}
                rowArray={rowArray}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

export default FoodTab
