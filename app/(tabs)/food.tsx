import { StyleSheet } from 'react-native'
import { View } from '@/components/Themed'
import { useState, useEffect } from 'react'
import DynamicTable from '@/components/DynamicTable'
import * as SQLite from "expo-sqlite"
import { toNumberOrZero, InputFood } from '@/components/InputFood'
import consoleLogClock from '@/debug_utils';
import { useRouter } from 'expo-router'

const createDatabase = (): SQLite.Database => {
    const db = SQLite.openDatabase("food.db")

    return db
}

const database = createDatabase()

const useForceUpdate = (): [number, () => void] => {
    const [value, setValue] = useState(0)
    return [value, () => setValue(value + 1)]
}

const FoodTab = () => {
    const [productName, setProductName] = useState<string | number>('')
    const [gramProtein, setProtein] = useState<string | number>('')
    const [gramFat, setFat] = useState<string | number>('')
    const [gramCarbs, setCarbs] = useState<string | number>('')
    const [kjEnergy, setEnergy] = useState<string | number>('')

    // todo move db to parent
    const createTable = (tx: SQLite.SQLTransaction) => {
        tx.executeSql("DROP TABLE IF EXISTS foods;"); // !! temporary, to prevent the db from ballooning in size when debugging.
        tx.executeSql(
            "CREATE TABLE IF NOT EXISTS foods (id INTEGER PRIMARY KEY NOT NULL, name TEXT, protein REAL, fat REAL, carbs REAL, energy REAL);"
        )

        // !! temporary, to fill the table
        for (let i = 1; i <= 20; i++) {
            consoleLogClock(i)
            tx.executeSql("INSERT INTO foods (name, protein, fat, carbs, energy) VALUES (?, ?, ?, ?, ?)", [
                `Food ${i}`,
                i * 10,
                i * 10,
                i * 10,
                i * 10
            ])
        }
    }

    useEffect(() => { database.transaction(createTable) }, [])

    const [forceUpdateId, forceUpdate] = useForceUpdate()

    const handleButtonPress = () => {
        if (productName === null || productName === "") {
            alert("Please type an ingredient name.")
            return false
        }

        const isValidNumber = (value: string | number) => !Number.isNaN(Number(value))

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
                tx.executeSql("INSERT INTO foods (name, protein, fat, carbs, energy) VALUES (?, ?, ?, ?, ?)", [
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

    const handlePressRow = (rowId: number) => {
        // get row with row_id from database
        // pass rowId to route
        // get row in page component and update it there too

        // todo https://stackoverflow.com/questions/35537229/how-can-i-update-the-parents-state-in-react
        // todo maybe modal is a good option? https://docs.expo.dev/router/advanced/modals/
        // todo find template again that I made this app from to look at how they did the modal thingy

        useRouter().push({
            pathname: '/editFoodPage',
            params: { rowId: rowId }
        })

        // todo what is good practice for passing parameters to components?
        // what I am doing now seems to be an anti pattern.
        // should I just let this be for now because "it works" and refactor later?
        // Essentially trade good practice in favour of development speed.
        // there seem to be a conflicting "good practices" between react native and react native with expo go.
        // in react native using global state (with optionally Redux) is good.
        // However, with expo go what I am doing seems perfectly acceptable.
        // react seems to make some seemingly simple things like passing parameters to and from a function very hard. A lot of boilerplate seems to be needed.
        // https://stackoverflow.com/questions/76604270/passing-object-using-expo-router
        // https://reactnavigation.org/docs/params/#passing-params-to-nested-navigators
        // https://expo.github.io/router/docs/migration/react-navigation/params/
        // https://reactnavigation.org/docs/params/#what-should-be-in-params
    }

    const [rowArray, setRowArray] = useState<string[][]>([])

    const getRows = (tx: SQLite.SQLTransaction) => {
        tx.executeSql(
            "SELECT * FROM foods",
            [],
            (_, { rows }) => {
                let rows_ = rows._array

                let rowArray: string[][] = []
                for (let i = 0; i < rows_.length; i++) {
                    rowArray.push(Object.values(rows_[i]))
                }

                setRowArray(rowArray)
            }
        )
    }

    useEffect(() => { database.transaction(getRows) }, [forceUpdateId])

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
