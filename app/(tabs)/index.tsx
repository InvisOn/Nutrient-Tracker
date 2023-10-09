import { StyleSheet } from 'react-native'
import { Text, View } from '@/components/Themed'

// todo HIGH PRIORITY add nutrition goal
// todo HIGH PRIORITY add progress towards nutrition goal tracking by calculating total nutrients consumed from foods_consumed table of current day
// todo MEDIUM PRIORITY add graph over intake over time
// todo LOW PRIORITY add get database button for db file or csv files
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
