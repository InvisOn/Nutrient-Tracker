import { StatusBar } from 'expo-status-bar';
import { ColorSchemeName, Platform, Pressable, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Link } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';

export const makeModalButton = (colorScheme: ColorSchemeName) => {
    return () => (<Link href="/modal" asChild>
        <Pressable>
            {({ pressed }) => (
                <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
            )}
        </Pressable>
    </Link>)
}

// todo what is the modal screen?
export default function ModalScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Modal</Text>
            {/* Use a light status bar on iOS to account for the black space above the modal */}
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
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
