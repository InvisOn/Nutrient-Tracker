import { StyleSheet } from 'react-native'
import { Text, View } from '@/components/Themed'
import Button from '@/components/Button'
import { useContext, useEffect, useState } from 'react'
import { DatabaseContext } from '@/database/databaseContext'
import { SQLTransaction } from 'expo-sqlite'
import { Nutrients } from '@/types/Food'

// todo HIGH PRIORITY add edit nutrition goal
// todo HIGH PRIORITY add progress towards nutrition goal tracking by calculating total nutrients consumed from foods_consumed table of current day
// todo MEDIUM PRIORITY add graph over intake over time
// todo LOW PRIORITY add get database button for db file or csv files
export default function OverviewTab() {
    const database = useContext(DatabaseContext)

    const [nutrientsGoal, setNutrientsGoal] = useState<Nutrients>({ gramsProtein: 0, gramsFat: 0, gramsCarbs: 0})

    const getNutrientGoal = (tx: SQLTransaction) => {
        tx.executeSql("SELECT grams_protein, grams_fat, grams_carbs FROM nutrients_goal", [],
            (_, { rows }) => {
                const goal = rows._array[0]
                setNutrientsGoal({
                    gramsProtein: goal['grams_protein'],
                    gramsFat: goal['grams_fat'],
                    gramsCarbs: goal['grams_carbs']})
            })
    }

    useEffect(() => { database.transaction(getNutrientGoal) }, [])

    return (
        <View style={styles.container}>
            <View style={styles.goalContainer}>
                <Text style={styles.title}>Nutrients Goal Grams per Day</Text>
            </View>
            <View style={styles.goalContainer}>
                <Text style={[styles.nutrientsText, styles.marginRight]}>
                    Protein: {nutrientsGoal.gramsProtein}
                </Text>
                <Text style={[styles.nutrientsText, styles.marginRight]}>
                    Fat: {nutrientsGoal.gramsFat}
                </Text>
                <Text style={[styles.nutrientsText, styles.marginRight]}>
                    Carbs: {nutrientsGoal.gramsCarbs}
                </Text>
            </View>
            <View style={styles.goalContainer}>
                <Button label='EDIT GOAL' onPress={() => {}} style={styles.button} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 6,
    },
    goalContainer: {
        flexDirection: 'row',
        marginTop: 5
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    nutrientsText: {
        flex: 1
    },
    marginRight: {
        marginRight: 6
    },
    button: {
        flex: 1
    }
})
