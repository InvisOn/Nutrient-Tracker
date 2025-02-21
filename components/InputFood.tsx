import { Text, View } from '@/components/Themed'
import { StyleSheet } from 'react-native'
import InputWithLabel from '@/components/InputWithLabel'
import Button from '@/components/Button'
import { calculateKjFromMacros } from '@/utils/food'
import { toNumber } from '@/utils/numbers'

type Props = {
    valueProductName: string,
    valueGramProtein: string | number,
    valueGramFat: string | number,
    valueGramCarbs: string | number,
    valueKjEnergy: string | number,
    onChangeTextProductName: (name: string) => void,
    onChangeTextGramProtein: (name: string | number) => void,
    onChangeTextGramFat: (name: string | number) => void,
    onChangeTextGramCarbs: (name: string | number) => void,
    onChangeTextKjEnergy: (name: string | number) => void,
    buttonLabel: string,
    onButtonPress: () => void
}

// TODO: MEDIUM PRIORITY add alert if total macro content food exceeds 100grams.
export const InputFood: React.FC<Props> = ({
    valueProductName,
    valueGramProtein,
    valueGramFat,
    valueGramCarbs,
    valueKjEnergy,
    onChangeTextProductName,
    onChangeTextGramProtein,
    onChangeTextGramFat,
    onChangeTextGramCarbs,
    onChangeTextKjEnergy,
    buttonLabel,
    onButtonPress
}) => {
    const makeEnergyPlaceholder = () => {
        const placeholder = toNumber(calculateKjFromMacros(Number(valueGramProtein), Number(valueGramFat), Number(valueGramCarbs)))

        return String(placeholder)
    }

    return (
        <View>
            <View style={styles.textMargin}>
                <Text>Input the food name and nutrient content per 100g.</Text>
            </View>
            <InputWithLabel
                label='Name:'
                inputMode='text'
                flex={0}
                placeholder='type name here'
                onChangeText={onChangeTextProductName}
                value={String(valueProductName)}
            />
            <View style={styles.inputContainer}>
                <InputWithLabel
                    label='Protein (g):'
                    inputMode='numeric'
                    flex={1}
                    placeholder='0'
                    onChangeText={onChangeTextGramProtein}
                    value={String(valueGramProtein)}
                />
                <InputWithLabel
                    label='Fat (g):'
                    inputMode='numeric'
                    flex={1}
                    placeholder='0'
                    onChangeText={onChangeTextGramFat}
                    value={String(valueGramFat)}
                />
                <InputWithLabel
                    label='Carbs (g):'
                    inputMode='numeric'
                    flex={1}
                    placeholder='0'
                    onChangeText={onChangeTextGramCarbs}
                    value={String(valueGramCarbs)}
                />
                <InputWithLabel  // TODO: LOW PRIORITY add toggle to switch from calls to kJ input. components/SwitchWithLabel.tsx
                    label='Energy (kJ):'
                    inputMode='numeric'
                    flex={1}
                    placeholder={makeEnergyPlaceholder()}
                    onChangeText={onChangeTextKjEnergy}
                    value={String(valueKjEnergy)}
                />
            </View>
            <Button label={buttonLabel} onPress={onButtonPress} />
        </View>
    )
}

const styles = StyleSheet.create({
    textMargin: {
        marginLeft: 6,
        marginRight: 6,
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 6
    }
})
