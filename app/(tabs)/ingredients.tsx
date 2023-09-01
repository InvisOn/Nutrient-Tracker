import { StyleSheet, Text } from 'react-native';
import { View } from '@/components/Themed';
import InputWithLabel from '@/components/InputWithLabel';
import Button from '@/components/Button';
import { useState, useEffect } from 'react';
import DynamicTable from '@/components/DynamicTable';
import * as SQLite from "expo-sqlite"

function createDatabase() {
    const db = SQLite.openDatabase("ingredients.db")

    return db
}

const db = createDatabase()

function useForceUpdate() {
    const [value, setValue] = useState(0)
    return [value, () => setValue(value + 1)]
}

export default function IngredientsTab() {
    const [productName, setProductName] = useState<string>('');
    const [protein, setProtein] = useState<string>('0');
    const [fat, setFat] = useState<string>('0');
    const [carbs, setCarbs] = useState<string>('0');
    const [calories, setCalories] = useState<string>('0');

    const handleAddIngredientPress = () => {
        alert(`You entered: ${productName}, ${protein}, ${fat}, ${carbs}, ${calories}`);
    };

    //todo connect sqlite database
    const [text, setText] = useState(null)
    const [forceUpdateId, forceUpdate] = useForceUpdate()

    const createTable = (tx: SQLite.SQLTransaction) => {
        tx.executeSql("DROP TABLE IF EXISTS items;"); // todo remove when done with this page
        tx.executeSql(
            "create table if not exists items (id integer primary key not null, name text, protein real, fat real, carbs real, energy real);"
        )


        for (let i = 1; i <= 20; i++) {
            // break;
            db.transaction(
                (tx) => {
                    tx.executeSql("insert into items (id, name, protein, fat, carbs, energy) values (0, ?)", [i,
                        `name ${i}`,
                        i,
                        i,
                        i,
                        i,])
                    tx.executeSql("select * from items", [], (_, { rows }) => console.log(JSON.stringify(rows)))
                },
                null,
                forceUpdate
            )
        }
    }

    useEffect(() => { db.transaction(createTable) }, [])

    const add = (
        productName: string,
        protein: number,
        fat: number,
        carbs: number,
        calories: number,
    ) => {
        // is text empty?
        if (productName === null || productName === "") {
            return false
        }

        db.transaction(
            (tx) => {
                tx.executeSql("insert into items ( name, protein, fat, carbs, energy) values (0, ?)", [productName,
                    protein,
                    fat,
                    carbs,
                    calories,])
                tx.executeSql("select * from items", [], (_, { rows }) => console.log(JSON.stringify(rows)))
            },
            null,
            forceUpdate,
        )
    }

    add("name", 1, 1, 1, 1)

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
