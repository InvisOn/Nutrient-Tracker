import { StyleSheet, Text } from 'react-native'
import { View } from '@/components/Themed'
import InputWithLabel from '@/components/InputWithLabel'
import Button from '@/components/Button'
import { useState, useEffect } from 'react'
import DynamicTable from '@/components/DynamicTable'
import * as SQLite from "expo-sqlite"

const createDatabase = (): SQLite.Database => {
    const db = SQLite.openDatabase("ingredients.db")

    return db
}

const database = createDatabase()

const useForceUpdate = (): [number, () => void] => {
    const [value, setValue] = useState(0)
    return [value, () => setValue(value + 1)]
}

const toNumberOrZero = (value: string | number) => {
    const num = Number(value === '' ? 0 : value)
    return Number.isNaN(num) ? 0 : num
}

const isValidNumber = (value: string | number) => !Number.isNaN(Number(value))

const IngredientsTab = () => {
    const [productName, setProductName] = useState<string | number>('')
    const [gram_protein, setProtein] = useState<string | number>('')
    const [gram_fat, setFat] = useState<string | number>('')
    const [gram_carbs, setCarbs] = useState<string | number>('')
    const [kj_energy, setEnergy] = useState<string | number>('')

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

    const calculateEnergyFromMacros = () => {
        const kcal_per_gram_protein = Number(gram_protein) * 4
        const kcal_per_gram_fat = Number(gram_fat) * 9
        const kcal_per_gram_carbs = Number(gram_carbs) * 4

        const kj_per_kcal = 4.184

        const total_kj = (kcal_per_gram_protein + kcal_per_gram_fat + kcal_per_gram_carbs) * kj_per_kcal

        return toNumberOrZero(Math.round(total_kj))
    }


    // Is used to trigger a re-render of `<DynamicTable>` to reflect database changes.
    const [forceUpdateId, forceUpdate] = useForceUpdate();


    const handleAddIngredientPress = () => {
        if (productName === null || productName === "") {
            alert("Please type an ingredient name.")
            return false
        }

        if (!isValidNumber(gram_protein) || !isValidNumber(gram_fat) || !isValidNumber(gram_carbs) || !isValidNumber(kj_energy)) {
            alert('Please input only numbers for protein, fat, carbs, and energy.')
            return false
        }

        const gram_protein_number = toNumberOrZero(gram_protein)
        const gram_fat_number = toNumberOrZero(gram_fat)
        const gram_carbs_number = toNumberOrZero(gram_carbs)
        const kj_energy_number = toNumberOrZero(kj_energy)

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

    const column_header = [
        'Ingredient',
        'Protein',
        'Fat',
        'Carbs',
        'Energy'
    ]

    const numericCols = [1, 2, 3, 4]

    const getIngredientsSql = "SELECT name, protein, fat, carbs, energy FROM ingredients"

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.textMargin}>
                <Text>Add the ingredient name and nutrient content per 100g.</Text>
            </View>
            <InputWithLabel
                label='Name:'
                inputMode='text'
                flex={0}
                placeholder=''
                onChangeText={(name: string | number) => setProductName(name)}
                value={String(productName)}
            />
            <View style={styles.containerMacros}>
                <InputWithLabel
                    label='Protein (g):'
                    inputMode='numeric'
                    flex={1}
                    placeholder='0'
                    onChangeText={(protein: string | number) => setProtein(protein)}
                    value={String(gram_protein)}
                />
                <InputWithLabel
                    label='Fat (g):'
                    inputMode='numeric'
                    flex={1}
                    placeholder='0'
                    onChangeText={(fat: string | number) => setFat(fat)}
                    value={String(gram_fat)}
                />
                <InputWithLabel
                    label='Carbs (g):'
                    inputMode='numeric'
                    flex={1}
                    placeholder='0'
                    onChangeText={(carbs: string | number) => setCarbs(carbs)}
                    value={String(gram_carbs)}
                />
                <InputWithLabel  // todo add toggle to switch from calls to kJ input
                    // todo calculates this value as a placeholder from macros
                    label='Energy (kJ):'
                    inputMode='numeric'
                    flex={1}
                    placeholder={String(calculateEnergyFromMacros())}
                    onChangeText={(calories: string | number) => setEnergy(calories)}
                    value={String(kj_energy)}
                />
            </View>
            <Button label='ADD INGREDIENT' onPress={handleAddIngredientPress} />
            <DynamicTable
                key={`forceupdate-${forceUpdateId}`}
                columns_header={column_header}
                flexColumn={{ columnIndex: 0, flex: 4 }}
                numericCols={numericCols}
                database={database}
                sql={getIngredientsSql}
            />
        </View>
    )
}

const styles = StyleSheet.create({
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
