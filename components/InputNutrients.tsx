import { StyleSheet, Text } from 'react-native'
import { View } from '@/components/Themed'
import InputWithLabel from '@/components/InputWithLabel'
import Button from '@/components/Button'

export const toNumberOrZero = (value: string | number) => {
    const num = Number(value === '' ? 0 : value)
    return Number.isNaN(num) ? 0 : num
}

type TableProps = {
    valueProductName: string | number,
    valueGramProtein: string | number,
    valueGramFat: string | number,
    valueGramCarbs: string | number,
    valueKjEnergy: string | number,
    onChangeTextProductName: (name: string | number) => void,
    onChangeTextGramProtein: (name: string | number) => void,
    onChangeTextGramFat: (name: string | number) => void,
    onChangeTextGramCarbs: (name: string | number) => void,
    onChangeTextKjEnergy: (name: string | number) => void,
    buttonLabel: string,
    onButtonPress: (name: string | number) => void
}

export const InputIngredients: React.FC<TableProps> = ({
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
    const calculateEnergyFromMacros = () => {
        const kcalPerGramProtein = Number(valueGramProtein) * 4
        const kcalPerGramFat = Number(valueGramFat) * 9
        const kcalPerGramCarbs = Number(valueGramCarbs) * 4

        const kjPerKcal = 4.184

        const totalKj = (kcalPerGramProtein + kcalPerGramFat + kcalPerGramCarbs) * kjPerKcal

        return toNumberOrZero(Math.round(totalKj))
    }

    return (
        <View>
            <View style={styles.textMargin}>
                <Text>Add the ingredient name and nutrient content per 100g.</Text>
            </View>
            <InputWithLabel
                label='Name:'
                inputMode='text'
                flex={0}
                placeholder='type name here'
                onChangeText={onChangeTextProductName}
                value={String(valueProductName)}
            />
            <View style={styles.containerMacros}>
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
                <InputWithLabel  // todo add toggle to switch from calls to kJ input
                    // todo calculates this value as a placeholder from macros
                    label='Energy (kJ):'
                    inputMode='numeric'
                    flex={1}
                    placeholder={String(calculateEnergyFromMacros())}
                    onChangeText={onChangeTextKjEnergy}
                    value={String(valueKjEnergy)}
                />
            </View>
            <Button label={buttonLabel} onPress={onButtonPress} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    textMargin: {
        marginLeft: 6,
        marginRight: 6,
        marginBottom: 10,
    },
    containerMacros: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 6,
    },
    buttonContainer: {
        height: 68,
        alignItems: 'center',
        justifyContent: 'center',
    }
})
