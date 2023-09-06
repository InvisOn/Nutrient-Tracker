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
    const [productName, setProductName] = useState<string | number>('')
    const [gram_protein, setProtein] = useState<string | number>('')
    const [gram_fat, setFat] = useState<string | number>('')
    const [gram_carbs, setCarbs] = useState<string | number>('')
    const [energy, setEnergy] = useState<string | number>('')

    // `forceUpdateId` is a state variable that changes every time `forceUpdate` is called. It's used as a key for the `<Items>` components to force them to re-render when the database changes. When `forceUpdate` is called, `forceUpdateId` changes, causing React to re-render components that depend on it. This is a way to manually trigger a re-render for functional components in React.
    const [forceUpdateId, forceUpdate] = useForceUpdate()

    const createTable = (tx: SQLite.SQLTransaction) => {
        tx.executeSql("DROP TABLE IF EXISTS ingredients;"); // !! temporary, to prevent the db from ballooning in size when debugging.
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
                    // tx.executeSql("SELECT * FROM ingredients", [], (_, { rows }) => console.log(JSON.stringify(rows)))
                },
                (error) => console.log(error),
                // forceUpdate
            )
        }
    }

    useEffect(() => { db.transaction(createTable) }, [])

    const calculateEnergyFromMacros = () => {
        const kcal_per_gram_protein = Number(gram_protein) * 4
        const kcal_per_gram_fat = Number(gram_fat) * 9
        const kcal_per_gram_carbs = Number(gram_carbs) * 4

        const kj_per_kcal = 4.184

        const total_kj = (kcal_per_gram_protein + kcal_per_gram_fat + kcal_per_gram_carbs) * kj_per_kcal

        return Math.round(total_kj)
    }

    const handleAddIngredientPress = () => {
        if (productName === null || productName === "") {
            alert("Please type an ingredient name.")
            return false
        }

        db.transaction(
            (tx) => {
                tx.executeSql("INSERT INTO ingredients (name, protein, fat, carbs, energy) VALUES (?, ?, ?, ?, ?)", [
                    productName,
                    gram_protein === '' ? 0 : gram_protein,
                    gram_fat === '' ? 0 : gram_fat,
                    gram_carbs === '' ? 0 : gram_carbs,
                    energy === '' ? calculateEnergyFromMacros() : '',
                ])
                tx.executeSql("SELECT * FROM ingredients", [], (_, { rows }) => console.log(JSON.stringify(rows)))
            },
            (error) => console.log(error),
            // forceUpdate
        )

        setProductName('')
        setProtein('')
        setFat('')
        setCarbs('')
        setEnergy('')
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

    // todo update table with stuff fom db in the ui
    // shoud be below type:
    // type Row = {
    //     [key: string]: string | number
    // };
    // try this:
    // tx.executeSql("SELECT name, protein, fat, carbs, energy FROM ingredients", [], (_, { rows }) => {
    //     const typedRows: Row[] = rows._array.map((row: any) => {
    //       const newRow: Row = {};
    //       Object.keys(row).forEach((key) => {
    //         newRow[key] = row[key];
    //       });
    //       return newRow;
    //     });
    //     console.log(JSON.stringify(typedRows));
    //   });
    // todo also figure out how to forceupdate the table in the ui

    // !! temporary, to fill the table
    const rows = [];
    for (let i = 1; i <= 20; i++) {
        rows.push({ key: i, Name: `Food ${i}`, Protein: i, Fat: i * 2, Carbs: i * 3, Energy: i * 4 });
    }

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
                    value={String(energy)}
                />
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
