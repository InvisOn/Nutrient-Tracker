import { StyleSheet, Text } from 'react-native'
import { View } from '@/components/Themed'
import InputWithLabel from '@/components/InputWithLabel'
import Button from '@/components/Button'

export const toNumberOrZero = (value: string | number) => {
    const num = Number(value === '' ? 0 : value)
    return Number.isNaN(num) ? 0 : num
}

type TableProps = {
    productName: string | number,
    gramProtein: string | number,
    gramFat: string | number,
    gramCarbs: string | number,
    kjEnergy: string | number,
    onChangeTextProductName: (name: string | number) => void,
    onChangeTextGramProtein: (name: string | number) => void,
    onChangeTextGramFat: (name: string | number) => void,
    onChangeTextGramCarbs: (name: string | number) => void,
    onChangeTextKjEnergy: (name: string | number) => void,
    buttonLabel: string,
    onButtonPress: (name: string | number) => void
}

const InputIngredients: React.FC<TableProps> = ({
    productName,
    gramProtein,
    gramFat,
    gramCarbs,
    kjEnergy,
    onChangeTextProductName,
    onChangeTextGramProtein,
    onChangeTextGramFat,
    onChangeTextGramCarbs,
    onChangeTextKjEnergy,
    buttonLabel,
    onButtonPress
}) => {
    const calculateEnergyFromMacros = () => {
        const kcalPerGramProtein = Number(gramProtein) * 4
        const kcalPerGramFat = Number(gramFat) * 9
        const kcalPerGramCarbs = Number(gramCarbs) * 4

        const kjPerKcal = 4.184

        const totalKj = (kcalPerGramProtein + kcalPerGramFat + kcalPerGramCarbs) * kjPerKcal

        return toNumberOrZero(Math.round(totalKj))
    }

    return (
        <View style={styles.container}>
            <View style={styles.textMargin}>
                <Text>Add the ingredient name and nutrient content per 100g.</Text>
            </View>
            <InputWithLabel
                label='Name:'
                inputMode='text'
                flex={0}
                placeholder=''
                onChangeText={onChangeTextProductName}
                value={String(productName)}
            />
            <View style={styles.containerMacros}>
                <InputWithLabel
                    label='Protein (g):'
                    inputMode='numeric'
                    flex={1}
                    placeholder='0'
                    onChangeText={onChangeTextGramProtein}
                    value={String(gramProtein)}
                />
                <InputWithLabel
                    label='Fat (g):'
                    inputMode='numeric'
                    flex={1}
                    placeholder='0'
                    onChangeText={onChangeTextGramFat}
                    value={String(gramFat)}
                />
                <InputWithLabel
                    label='Carbs (g):'
                    inputMode='numeric'
                    flex={1}
                    placeholder='0'
                    onChangeText={onChangeTextGramCarbs}
                    value={String(gramCarbs)}
                />
                <InputWithLabel  // todo add toggle to switch from calls to kJ input
                    // todo calculates this value as a placeholder from macros
                    label='Energy (kJ):'
                    inputMode='numeric'
                    flex={1}
                    placeholder={String(calculateEnergyFromMacros())}
                    onChangeText={onChangeTextKjEnergy}
                    value={String(kjEnergy)}
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

export default InputIngredients
