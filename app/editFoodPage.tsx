import { StyleSheet } from 'react-native'
import { View } from '@/components/Themed'
import { InputFood } from '@/components/InputFood'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useContext, useEffect, useState } from 'react'
import { DatabaseContext } from '@/database/databaseContext'
import { SQLTransaction } from 'expo-sqlite'
import Button from '@/components/Button'

// ? should I addd this page to app/_layout.tsx?
const EditFoodPage: React.FC = () => {
    const params = useLocalSearchParams()
    const database = useContext(DatabaseContext)
    const rowId = String(params.rowId)

    const [productName, setProductName] = useState<string>('')
    const [gramProtein, setProtein] = useState<string | number>('')
    const [gramFat, setFat] = useState<string | number>('')
    const [gramCarbs, setCarbs] = useState<string | number>('')
    const [kjEnergy, setKjEnergy] = useState<string | number>('')

    const getFood = (tx: SQLTransaction) => {
        tx.executeSql(
            "SELECT name, protein, fat, carbs, energy FROM foods WHERE id = ?",
            [rowId],
            (_, { rows }) => {
                const row = rows.item(0)

                setProductName(row["name"])
                setProtein(row["protein"])
                setFat(row["fat"])
                setCarbs(row["carbs"])
                setKjEnergy(row["energy"])
            }
        )
    }

    useEffect(() => { database.transaction(getFood) }, [])

    const onEditButtonPress = () => {
        database.transaction(
            (tx: SQLTransaction) => {
                tx.executeSql(
                    "UPDATE foods SET name = ?, protein = ?, fat = ?, carbs = ?, energy = ? WHERE id = ?",
                    [productName, gramProtein, gramFat, gramCarbs, kjEnergy, rowId]
                )
            }
        )

        useRouter().back()
    }

    const onDeleteButtonPress = () => {
        database.transaction(
            (tx: SQLTransaction) => {
                tx.executeSql(
                    "DELETE FROM foods WHERE id = ?",
                    [rowId]
                )
            }
        )

        useRouter().back()
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: "Edit Food" }} />
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
                onChangeTextKjEnergy={setKjEnergy}
                buttonLabel={'EDIT INGREDIENT'}
                onButtonPress={onEditButtonPress}
            />
            <Button label='DELETE FOOD' onPress={onDeleteButtonPress} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10
    }
})

export default EditFoodPage
