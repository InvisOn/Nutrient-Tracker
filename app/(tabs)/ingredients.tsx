import { StyleSheet, Text } from 'react-native';
import { View } from '@/components/Themed';
import InputWithLabel from '@/components/InputWithLabel';
import Button from '@/components/Button';
import { useState, useEffect } from 'react';
import DynamicTable from '@/components/DynamicTable';
import * as SQLite from "expo-sqlite"

function createDatabase(): SQLite.Database {
    const db = SQLite.openDatabase("ingredients.db")

    return db
}

const db = createDatabase()

function useForceUpdate(): [number, () => void] {
    const [value, setValue] = useState(0)
    return [value, () => setValue(value + 1)]
}

export default function IngredientsTab() {
    const [productName, setProductName] = useState<string>('')
    const [protein, setProtein] = useState<string>('0')
    const [fat, setFat] = useState<string>('0')
    const [carbs, setCarbs] = useState<string>('0')
    const [calories, setCalories] = useState<string>('0')

    const handleAddIngredientPress = () => {
        alert(`You entered: ${productName}, ${protein}, ${fat}, ${carbs}, ${calories}`)
        addIngredient(productName, parseFloat(protein), parseFloat(fat), parseFloat(carbs), parseFloat(calories))
    };

    //todo connect sqlite database
    const [forceUpdateId, forceUpdate] = useForceUpdate()

    const createTable = (tx: SQLite.SQLTransaction) => {
        tx.executeSql("DROP TABLE IF EXISTS ingredients;"); // !! temporary, to force execution of the code below
        tx.executeSql(
            "CREATE TABLE IF NOT EXISTS  ingredients (id INTEGER PRIMARY KEY NOT NULL, name TEXT, protein REAL, fat REAL, carbs REAL, energy REAL);"
        )

        // !! temporary, to fill the table
        for (let i = 1; i <= 20; i++) {
            db.transaction(
                (tx) => {
                    tx.executeSql("INSERT INTO ingredients (name, protein, fat, carbs, energy) VALUES (?, ?, ?, ?, ?)", [
                        `name ${i}`,
                        i,
                        i,
                        i,
                        i,])
                    tx.executeSql("SELECT * FROM ingredients", [], (_, { rows }) => console.log(JSON.stringify(rows)))
                },
                (error) => console.log(error),
                forceUpdate
            )
        }
    }

    useEffect(() => { db.transaction(createTable) }, [])

    const addIngredient = (
        productName: string,
        protein: number,
        fat: number,
        carbs: number,
        calories: number,
    ) => {
        if (productName === null || productName === "") {
            return false
        }

        db.transaction(
            (tx) => {
                tx.executeSql("INSERT INTO ingredients (name, protein, fat, carbs, energy) VALUES (?, ?, ?, ?, ?)", [productName,
                    protein,
                    fat,
                    carbs,
                    calories,])
                tx.executeSql("SELECT * FROM ingredients", [], (_, { rows }) => console.log(JSON.stringify(rows)))
            },
            (error) => console.log(error),
            forceUpdate,
        )
    }

    const columns = [
        { title: 'Name' },
        { title: 'Protein', numeric: true },
        { title: 'Fat', numeric: true },
        { title: 'Carbs', numeric: true },
        { title: 'Energy', numeric: true }
    ];

    let column_map: { [key: string]: string } = {
        'Name': "Name",
        'Protein': "Protein (g)",
        'Fat': "Fat (g)",
        'Carbs': "Carbs (g)",
        'Energy': "Energy (kJ)",
    }

    // !! temporary, to fill the table
    const rows = [];
    for (let i = 1; i <= 20; i++) {
        rows.push({ key: i, Name: `Food ${i}`, Protein: i, Fat: i * 2, Carbs: i * 3, Energy: i * 4 });
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.textMargin}>
                <Text>Add the ingredient name and nutrient information per 100g.</Text>
            </View>
            <InputWithLabel
                label='Name:'
                inputMode='text'
                flex={0}
                placeholder=''
                onChangeText={(name: string) => setProductName(name)} />
            <View style={styles.containerMacros}>
                <InputWithLabel
                    label='Protein (g):'
                    inputMode='numeric'
                    flex={1}
                    placeholder='0'
                    onChangeText={(protein: string) => setProtein(protein)} />
                <InputWithLabel
                    label='Fat (g):'
                    inputMode='numeric'
                    flex={1}
                    placeholder='0'
                    onChangeText={(fat: string) => setFat(fat)} />
                <InputWithLabel
                    label='Carbs (g):'
                    inputMode='numeric'
                    flex={1}
                    placeholder='0'
                    onChangeText={(carbs: string) => setCarbs(carbs)} />
                <InputWithLabel  // todo add toggle to switch from calls to kJ input
                    // todo calculates this value as a placeholder from macros
                    label='Energy (kJ):'
                    inputMode='numeric'
                    flex={1}
                    placeholder='0'
                    onChangeText={(calories: string) => setCalories(calories)} />
            </View>
            <Button label='ADD INGREDIENT' onPress={handleAddIngredientPress} />
            <DynamicTable columns={columns} rows={rows} column_map={column_map} />
        </View>
    )
};

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
});
