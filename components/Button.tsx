import { StyleSheet, View, Pressable, Text } from 'react-native';

export type Props = {
    label: string;
    onPress: (...args: any[]) => void;
}

const Button: React.FC<Props> = ({
    label, onPress
}) => {
    // todo How to make this minimum size based on the screen so that it is never too big?
    // todo currently the size is controlled by the View that this component is in.
    return (
        <View
            style={[styles.buttonContainer, { borderRadius: 3, backgroundColor: "#2196f3" }]}>
            <Pressable
                style={[styles.button]}
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
    buttonContainer: {
        marginVertical: 10,
        marginHorizontal: 6,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,

    },
});

export default Button;
