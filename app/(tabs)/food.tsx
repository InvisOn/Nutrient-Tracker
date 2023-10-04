import { StyleSheet } from 'react-native'
import { View } from '@/components/Themed'
import { useState, useEffect, useContext, useCallback } from 'react'
import DynamicTable from '@/components/DynamicTable'
import { SQLTransaction } from "expo-sqlite"
import { toNumberOrZero, InputFood } from '@/components/InputFood'
import { useFocusEffect, useRouter } from 'expo-router'
import { DatabaseContext } from '@/database/databaseContext'
import { convertSqlRows } from '@/database/databaseUtils'
import { useForceUpdate } from '@/utils/forceUpdate'

const FoodTab = () => {
    const database = useContext(DatabaseContext)

    const [productName, setProductName] = useState<string>('')
    const [gramProtein, setProtein] = useState<string | number>('')
    const [gramFat, setFat] = useState<string | number>('')
    const [gramCarbs, setCarbs] = useState<string | number>('')
    const [kjEnergy, setEnergy] = useState<string | number>('')

    const [forceUpdateId, forceUpdate] = useForceUpdate()

    const handleButtonPress = () => {
        if (productName === null || productName === "") {
            alert("Please type an ingredient name.")
            return false
        }

        const isValidNumber = (value: string | number) => !Number.isNaN(Number(value) && Number(value) <= 0)

        if (!isValidNumber(gramProtein) || !isValidNumber(gramFat) || !isValidNumber(gramCarbs) || !isValidNumber(kjEnergy)) {
            alert('Please input only numbers for protein, fat, carbs, and energy.')
            return false
        }

        const gramProteinNumber = toNumberOrZero(gramProtein)
        const gramFatNumber = toNumberOrZero(gramFat)
        const gramCarbsNumber = toNumberOrZero(gramCarbs)
        const kjEnergyNumber = toNumberOrZero(kjEnergy)

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
            forceUpdate // Re-render when a food is added.
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
            "SELECT * FROM foods ORDER BY id DESC",
            [],
            (_, { rows }) => setRowArray(convertSqlRows(rows))
        )
    }

    const handlePressRow = (rowId: number) => {
        useRouter().push({
            pathname: '/editFoodPage',
            params: { rowId: rowId }
        })
    }


    // Re-render when a food is edited.
    useFocusEffect(
        useCallback(() => {
            database.transaction(getRowsArrayFood)
        }, [])
    )

    // Re-render the when a food is added.
    useEffect(() => { database.transaction(getRowsArrayFood) }, [forceUpdateId])

    const numericCols = [1, 2, 3, 4]
    const primaryKeyCol = 0
    const columnHeader = [
        'Ingredient',
        'Protein',
        'Fat',
        'Carbs',
        'Energy'
    ]


    return (
        <View style={styles.container}>
            <InputFood
                valueProductName={String(productName)}
                valueGramProtein={String(gramProtein)}
                valueGramFat={String(gramFat)}
                valueGramCarbs={String(gramCarbs)}
                valueKjEnergy={String(kjEnergy)}
                onChangeTextProductName={setProductName}
                onChangeTextGramProtein={setProtein}
                onChangeTextGramFat={setFat}
                onChangeTextGramCarbs={setCarbs}
                onChangeTextKjEnergy={setEnergy}
                buttonLabel={'ADD FOOD'}
                onButtonPress={handleButtonPress}
            />
            <DynamicTable
                key={`forceUpdateId-${forceUpdateId}`}
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
    },
    textMargin: {
        marginLeft: 6,
        marginRight: 6,
        marginBottom: 10,
    },
    containerMacros: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 6,
    },
    buttonContainer: {
        height: 68,
        alignItems: 'center',
        justifyContent: 'center',
    }
})

export default FoodTab
