import { StyleSheet, TextInput } from 'react-native'
import { Text, View } from '@/components/Themed'
import Button from '@/components/Button'
import { useContext, useEffect, useState } from 'react'
import { DatabaseContext } from '@/database/databaseContext'
import { SQLTransaction } from 'expo-sqlite'
import { Nutrients } from '@/types/Food'
import { isValidNonNegativeNumber } from '@/utils/numbers'
import { useForceRender } from '@/utils/forceRender'

type thing = {
    input: boolean,
    placeholder?: string,
    onChangeText?: (text: string) => void,
    value?: string,
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
                placeholderTextColor='#9a9a9a'
            />
        )
    } else {
        return (
            <Text style={[styles.nutrientsText, styles.marginRight, {
                textAlign: 'left',
                paddingLeft: 5, paddingRight: 6
            }]}>
                {text}
            </Text>
        )
    }

}

// todo MEDIUM PRIORITY add graph over intake over time
// todo LOW PRIORITY add get database button for db file or csv files
export default function OverviewTab() {
    const database = useContext(DatabaseContext)

    const [nutrientsGoal, setNutrientsGoal] = useState<Nutrients>({ gramsProtein: 0, gramsFat: 0, gramsCarbs: 0 })

    const [proteinGoal, setProteinGoal] = useState(String(nutrientsGoal.gramsProtein))
    const [fatGoal, setFatGoal] = useState(String(nutrientsGoal.gramsFat))
    const [carbsGoal, setCarbsGoal] = useState(String(nutrientsGoal.gramsCarbs))

    const [nutrientsGoalProgress, setNutrientsGoalProgress] = useState<Nutrients>({ gramsProtein: 0, gramsFat: 0, gramsCarbs: 0 })

    const [editingGoal, setEditingGoal] = useState(false)

    const [forceRenderId, forceRender] = useForceRender()

    useEffect(() => { database.transaction(getNutrientGoal) }, [forceRenderId])

    const getNutrientGoal = (tx: SQLTransaction) => {
        tx.executeSql("SELECT grams_protein, grams_fat, grams_carbs FROM nutrients_goal", [],
            (_, { rows }) => {
                const goal = rows._array[0]
                setNutrientsGoal({ // bug if table empty (no goal set) then ` WARN  Possible Unhandled Promise Rejection (id: 0)`
                    gramsProtein: goal['grams_protein'],
                    gramsFat: goal['grams_fat'],
                    gramsCarbs: goal['grams_carbs']
                })
            })
    }

    const setGoal = () => {
        setProteinGoal(proteinGoal.replace(/^0+/, ''))
        setFatGoal(fatGoal.replace(/^0+/, ''))
        setCarbsGoal(carbsGoal.replace(/^0+/, ''))

        const proteinGoalNumber = Number(proteinGoal)
        const fatGoalNumber = Number(fatGoal)
        const carbsGoalNumber = Number(carbsGoal)

        setNutrientsGoal({
            gramsProtein: proteinGoalNumber,
            gramsFat: fatGoalNumber,
            gramsCarbs: carbsGoalNumber
        })

        database.transaction(
            (tx: SQLTransaction) => {
                tx.executeSql("UPDATE nutrients_goal SET grams_protein = ?, grams_fat = ?, grams_carbs = ?", [
                    proteinGoalNumber,
                    fatGoalNumber,
                    carbsGoalNumber])
            }
        )

        forceRender()
        setEditingGoal(false)
    }

    const onPress = () => {
        if (editingGoal) {
            if (!isValidNonNegativeNumber(proteinGoal) || !isValidNonNegativeNumber(fatGoal) || !isValidNonNegativeNumber(carbsGoal)) {
                alert("Please input only numbers.")

            } else {
                setGoal()

                setEditingGoal(false)
            }
        } else {
            setProteinGoal((String(nutrientsGoal.gramsProtein)))
            setFatGoal((String(nutrientsGoal.gramsFat)))
            setCarbsGoal((String(nutrientsGoal.gramsCarbs)))

            setEditingGoal(true)
        }
    }

    const getProgressNutrientGoal = (tx: SQLTransaction) => {
        tx.executeSql(
            `SELECT IFNULL(ROUND(SUM(food_consumed.grams_consumed * foods.protein * 0.01), 2), 0) AS total_protein,
                    IFNULL(ROUND(SUM(food_consumed.grams_consumed * foods.fat * 0.01), 2), 0)  AS total_fat,
                    IFNULL(ROUND(SUM(food_consumed.grams_consumed * foods.carbs * 0.01), 2), 0)  AS total_carbs,
                    date('now', 'localtime') As today,
                    food_consumed.date_consumed as consumed
            FROM food_consumed
            JOIN foods ON food_consumed.id_food = foods.id_food
            WHERE date('now', 'localtime') = food_consumed.date_consumed`,
            [],
            (_, { rows }) => {
                const goalProgress = rows._array[0]
                setNutrientsGoalProgress({
                    gramsProtein: goalProgress['total_protein'],
                    gramsFat: goalProgress['total_fat'],
                    gramsCarbs: goalProgress['total_carbs']
                })
            })

    }

    database.transaction(getProgressNutrientGoal)

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Nutrients Goal Grams per Day</Text>
            </View>
            <View style={styles.goalContainer}>
                <Text style={[styles.nutrientsText, styles.marginRight]}>
                    Protein:
                </Text>
                <InputOrText
                    input={editingGoal}
                    placeholder={proteinGoal}
                    onChangeText={setProteinGoal}
                    value={proteinGoal}
                    text={nutrientsGoal.gramsProtein} />
                <Text style={[styles.nutrientsText, styles.marginRight]}>
                    Fat:
                </Text>
                <InputOrText
                    input={editingGoal}
                    placeholder={fatGoal}
                    onChangeText={setFatGoal}
                    value={fatGoal}
                    text={nutrientsGoal.gramsFat} />
                <Text style={[styles.nutrientsText, styles.marginRight]}>
                    Carbs:
                </Text>
                <InputOrText
                    input={editingGoal}
                    placeholder={carbsGoal}
                    onChangeText={setCarbsGoal}
                    value={carbsGoal}
                    text={nutrientsGoal.gramsCarbs} />
            </View>
            <Button label={editingGoal ? 'SET GOAL' : 'EDIT GOAL'} onPress={onPress} />
            <View style={styles.goalProgressContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Progress Nutrients Goal</Text>
                </View>
                <View style={styles.goalContainer}>
                    <Text style={[styles.nutrientsText, styles.marginRight]}>
                        Protein:
                    </Text>
                    <InputOrText input={false} text={nutrientsGoalProgress.gramsProtein} />
                    <Text style={[styles.nutrientsText, styles.marginRight]}>
                        Fat:
                    </Text>
                    <InputOrText input={false} text={nutrientsGoalProgress.gramsFat} />
                    <Text style={[styles.nutrientsText, styles.marginRight]}>
                        Carbs:
                    </Text>
                    <InputOrText input={false} text={nutrientsGoalProgress.gramsCarbs} />
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
        borderColor: '#fff',
        color: '#fff'
    }
})
