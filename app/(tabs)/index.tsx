import { StyleSheet, TextInput } from 'react-native'
import { Text, View } from '@/components/Themed'
import Button from '@/components/Button'
import { useContext, useEffect, useState } from 'react'
import { DatabaseContext } from '@/database/databaseContext'
import { SQLTransaction } from 'expo-sqlite'
import { Nutrients } from '@/types/Food'
import { isValidNonNegativeNumber, isValidNumber } from '@/utils/numbers'
import { useForceRender } from '@/utils/forceRender'

type thing = {
    input: boolean,
    placeholder: string,
    onChangeText: (text: string) => void,
    value: string,
    text: number
}

const InputOrText: React.FC<thing> = ({
    input,
    placeholder,
    onChangeText,
    value,
    text
}) => {
    if (input) {
        return (
            <TextInput
                style={[styles.input, styles.marginRight]}
                placeholder={placeholder}
                inputMode='numeric'
                onChangeText={onChangeText}
                value={value}
            />
        )
    } else {
        return (
            <Text style={[styles.nutrientsText, styles.marginRight, { textAlign: 'left',
            paddingLeft: 5, paddingRight: 6
             }]}>
                {text}
            </Text>
        )
    }

}

// todo HIGH PRIORITY add edit nutrition goal
// todo HIGH PRIORITY add progress towards nutrition goal tracking by calculating total nutrients consumed from foods_consumed table of current day
// todo MEDIUM PRIORITY add graph over intake over time
// todo LOW PRIORITY add get database button for db file or csv files
export default function OverviewTab() {
    const database = useContext(DatabaseContext)

    const [nutrientsGoal, setNutrientsGoal] = useState<Nutrients>({ gramsProtein: 0, gramsFat: 0, gramsCarbs: 0 })

    const [editingGoal, setEditingGoal] = useState(false)

    const [protein, setProtein] = useState(String(nutrientsGoal.gramsProtein))
    const [fat, setFat] = useState(String(nutrientsGoal.gramsFat))
    const [carbs, setCarbs] = useState(String(nutrientsGoal.gramsCarbs))

    const [forceRenderId, forceRender] = useForceRender()

    useEffect(() => { database.transaction(getNutrientGoal) }, [forceRenderId])

    const getNutrientGoal = (tx: SQLTransaction) => {
        tx.executeSql("SELECT grams_protein, grams_fat, grams_carbs FROM nutrients_goal", [],
            (_, { rows }) => {
                const goal = rows._array[0]
                setNutrientsGoal({
                    gramsProtein: goal['grams_protein'],
                    gramsFat: goal['grams_fat'],
                    gramsCarbs: goal['grams_carbs']
                })
            })
    }

    const setGoal = () => {
        setProtein(protein.replace(/^0+/, ''))
        setFat(fat.replace(/^0+/, ''))
        setCarbs(carbs.replace(/^0+/, ''))

        const proteinGoal = Number(protein)
        const fatGoal = Number(fat)
        const carbsGoal = Number(carbs)

        setNutrientsGoal({
            gramsProtein: proteinGoal,
            gramsFat: fatGoal,
            gramsCarbs: carbsGoal
        })

        database.transaction(
            (tx: SQLTransaction) => {
                tx.executeSql("UPDATE nutrients_goal SET grams_protein = ?, grams_fat = ?, grams_carbs = ?", [
                    proteinGoal,
                    fatGoal,
                    carbsGoal])
            }
        )

        forceRender()
        setEditingGoal(false)
    }

    const onPress = () => {
        if (editingGoal) {
            if (!isValidNonNegativeNumber(protein) || !isValidNonNegativeNumber(fat) || !isValidNonNegativeNumber(carbs)) {
                alert("Please input only numbers.")

            } else {
                setGoal()

                setEditingGoal(false)
            }
        } else {
            setProtein((String(nutrientsGoal.gramsProtein)))
            setFat((String(nutrientsGoal.gramsFat)))
            setCarbs((String(nutrientsGoal.gramsCarbs)))

            setEditingGoal(true)
        }
    }
    // todo add progress towards goal today WIP


    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Nutrients Goal Grams per Day</Text>
            </View>
            <View style={styles.goalContainer}>
                <Text style={[styles.nutrientsText, styles.marginRight]}>
                    Protein:
                </Text>
                <InputOrText input={editingGoal} placeholder={protein} onChangeText={setProtein} value={protein} text={nutrientsGoal.gramsProtein} />
                <Text style={[styles.nutrientsText, styles.marginRight]}>
                    Fat:
                </Text>
                <InputOrText input={editingGoal} placeholder={fat} onChangeText={setFat} value={fat} text={nutrientsGoal.gramsFat} />
                <Text style={[styles.nutrientsText, styles.marginRight]}>
                    Carbs:
                </Text>
                <InputOrText input={editingGoal} placeholder={carbs} onChangeText={setCarbs} value={carbs} text={nutrientsGoal.gramsCarbs} />
            </View>
            <Button label={editingGoal ? 'SET GOAL' : 'EDIT GOAL'} onPress={onPress} />
            <View style={styles.goalProgressContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Progress Nutrients Goal</Text>
                </View>
                <View style={styles.goalContainer}>
                    <Text style={[styles.nutrientsTextGoal, styles.marginRight]}>
                        Protein: 62
                    </Text>
                    <Text style={[styles.nutrientsTextGoal, styles.marginRight]}>
                        Fat: 32
                    </Text>
                    <Text style={[styles.nutrientsTextGoal, styles.marginRight]}>
                        Carbs: 144
                    </Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    titleContainer: {
        flexDirection: 'row',
        margin: 6,
        alignItems: 'center',
        justifyContent: 'flex-start',
        textAlignVertical: 'top'
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    goalContainer: {
        flexDirection: 'row',
        margin: 6,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    goalProgressContainer: {
    },
    nutrientsText: {
        height: 30,
        textAlignVertical: 'center',
        textAlign: 'right',
        flex: 1
    },
    nutrientsTextGoal: {
        height: 30,
        textAlignVertical: 'center',
        textAlign: 'left',
        flex: 1
    },
    marginRight: {
        marginRight: 6
    },
    marginRightWhileInput: {
        marginRight: 0
    },
    input: {
        height: 30,
        padding: 5,
        borderWidth: 1,
        flex: 1,
    }
})
