import { StyleSheet } from 'react-native'
import { View } from '@/components/Themed'
import { useState, useEffect } from 'react'
import DynamicTable from '@/components/DynamicTable'
import * as SQLite from "expo-sqlite"
import { useRouter } from 'expo-router'
import { toNumberOrZero, InputIngredients } from '@/components/InputNutrients'

const createDatabase = (): SQLite.Database => {
    const db = SQLite.openDatabase("ingredients.db")

    return db
}

const database = createDatabase()

const useForceUpdate = (): [number, () => void] => {
    const [value, setValue] = useState(0)
    return [value, () => setValue(value + 1)]
}

const isValidNumber = (value: string | number) => !Number.isNaN(Number(value))

const IngredientsTab = () => {
    const [productName, setProductName] = useState<string | number>('')
    const [gramProtein, setProtein] = useState<string | number>('')
    const [gramFat, setFat] = useState<string | number>('')
    const [gramCarbs, setCarbs] = useState<string | number>('')
    const [kjEnergy, setEnergy] = useState<string | number>('')

    const createTable = (tx: SQLite.SQLTransaction) => {
        tx.executeSql("DROP TABLE IF EXISTS ingredients;"); // !! temporary, to prevent the db from ballooning in size when debugging.
        tx.executeSql(
            "CREATE TABLE IF NOT EXISTS  ingredients (id INTEGER PRIMARY KEY NOT NULL, name TEXT, protein REAL, fat REAL, carbs REAL, energy REAL);"
        )

        // !! temporary, to fill the table
        for (let i = 20; i >= 1; i--) {
            tx.executeSql("INSERT INTO ingredients (name, protein, fat, carbs, energy) VALUES (?, ?, ?, ?, ?)", [
                `Food ${i}`,
                i * 10,
                i * 10,
                i * 10,
                i * 10
            ])
        }
    }

    useEffect(() => { database.transaction(createTable) }, [])

    // Is used to trigger a re-render of `<DynamicTable>` to reflect database changes.
    // console.log(1) // bug The table renders twice when it is updated.
    const [forceUpdateId, forceUpdate] = useForceUpdate();

    const handleAddIngredientPress = () => {
        if (productName === null || productName === "") {
            alert("Please type an ingredient name.")
            return false
        }

        if (!isValidNumber(gramProtein) || !isValidNumber(gramFat) || !isValidNumber(gramCarbs) || !isValidNumber(kjEnergy)) {
            alert('Please input only numbers for protein, fat, carbs, and energy.')
            return false
        }

        const gram_protein_number = toNumberOrZero(gramProtein)
        const gram_fat_number = toNumberOrZero(gramFat)
        const gram_carbs_number = toNumberOrZero(gramCarbs)
        const kj_energy_number = toNumberOrZero(kjEnergy)

        database.transaction(
            (tx) => {
                tx.executeSql("INSERT INTO ingredients (name, protein, fat, carbs, energy) VALUES (?, ?, ?, ?, ?)", [
                    productName,
                    gram_protein_number,
                    gram_fat_number,
                    gram_carbs_number,
                    kj_energy_number,
                ])
            },
            undefined,
            forceUpdate
        )

        setProductName('')
        setProtein('')
        setFat('')
        setCarbs('')
        setEnergy('')
    }

    const handlePressRow = (row_id: number) => {
        const router = useRouter()
        router.push('/editIngredientPage')
    }

    const columnHeader = [
        'Ingredient',
        'Protein',
        'Fat',
        'Carbs',
        'Energy'
    ]

    const numericCols = [1, 2, 3, 4]
    const primaryKeyCol = 0
    const getIngredientsSql = "SELECT * FROM ingredients"

    return (
        <View style={styles.container}>
            <InputIngredients
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
                buttonLabel={'ADD INGREDIENT'}
                onButtonPress={handleAddIngredientPress}
            />
            <DynamicTable
                key={`forceUpdateId-${forceUpdateId}`}
                columnsHeader={columnHeader}
                flexColumn={{ columnIndex: 0, flex: 4 }}
                numericCols={numericCols}
                primaryKeyCol={primaryKeyCol}
                onPressRow={handlePressRow}
                database={database}
                sql={getIngredientsSql}
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

export default IngredientsTab
