import { StyleSheet, View, Pressable, Text, StyleProp, ViewStyle } from 'react-native';

export type Props = {
    label: string;
    onPress: (...args: any[]) => void;
    style?: StyleProp<ViewStyle>
}

const Button: React.FC<Props> = ({
    label, onPress, style
}) => {
    return (
        <View style={[{ marginVertical: 10, marginHorizontal: 6 }, style]}>
            <Pressable
                style={({pressed}) => [
                    styles.button, { borderRadius: 3, backgroundColor: pressed ? "#0c7cd5" : "#2196f3" }
                ]
                }
                onPress={onPress}>
                <Text style={[styles.buttonLabel, { fontSize: 15, color: "#ffffff", fontWeight: 'bold' }]}>
                    {label}
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        padding: 5,
    },
    buttonLabel: {
        color: '#fff',
        fontSize: 16,
    },
});

export default Button;
