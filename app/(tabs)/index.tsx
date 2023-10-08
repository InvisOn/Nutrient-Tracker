import { StyleSheet } from 'react-native'
import { Text, View } from '@/components/Themed'

// todo add get database button, db file, csv
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
