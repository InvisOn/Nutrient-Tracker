import { StyleSheet } from 'react-native'
import { Text, View } from '@/components/Themed'

// todo calculate total nutrients consumed from foods_consumed table of current day
// todo add get database button for db file or csv files
// todo add nutrition goal
// todo add progress towards nutrition goal tracking
// todo add graph over intake over time
export default function OverviewTab() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Overview</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    }
})
