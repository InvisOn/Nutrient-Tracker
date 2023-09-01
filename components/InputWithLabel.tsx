import { StyleSheet, TextInput } from 'react-native';
import React from 'react';

import { Text, View } from '@/components/Themed';

type Props = {
    label: string;
    inputMode: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
    flex: number;
    placeholder: string;
    onChangeText: (text: string) => void
}

const InputWithLabel: React.FC<Props> = ({
    label,
    inputMode,
    flex,
    placeholder,
    onChangeText
}) => {
    return (
        <View style={{ flex: flex }}>
            <Text style={[styles.label, styles.margin]}>
                {label}
            </Text>
            <TextInput
                style={[styles.input, styles.margin]}
                placeholder={placeholder}
                inputMode={inputMode}
                onChangeText={onChangeText}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: { marginVertical: 10 },
    margin: {
        marginLeft: 6,
        marginRight: 6,
    },
    label: {
        marginBottom: 4,
    },
    input: {
        height: 30,
        padding: 5,
        borderWidth: 1,
    }
});

export default InputWithLabel;
