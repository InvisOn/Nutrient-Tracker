import { StyleSheet } from 'react-native'
import { Text, View } from '@/components/Themed'
import { alertTime, consoleLogTime, pathExists  } from '@/utils/debug'

// todo allow adding a new ingredient / food / meal that the user has consumed.
// todo add get database button, db file, csv
export default function OverviewTab() {
    pathExists('SQLite/food.db', true)

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
});
