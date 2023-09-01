import React, { useState } from 'react';
import { View, Switch, StyleSheet, Text } from 'react-native';

export type Props = {
    label: string;
}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginLeft: 6,
        marginRight: 6,
        marginBottom: 4,
    }, switch: {
        marginTop: -5
    }
});

const SwitchWithLabel: React.FC<Props> = ({ // todo finish this
    label
}) => {
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    return (
      <View style={styles.container}>
        <Text>
            {label}
        </Text>
        <Switch style={styles.switch}
          trackColor={{false: '#81b0ff', true: '#81b0ff'}}
          thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
    );
}


export default SwitchWithLabel;