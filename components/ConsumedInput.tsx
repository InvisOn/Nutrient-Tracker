import { StyleSheet, TextInput } from 'react-native'
import { View, Text } from '@/components/Themed'
import Button from '@/components/Button'
import { NutritionPerHectogram } from '@/types/Food'
import { calcMacroContentFoodPortion } from '@/utils/food'

type Props = {
    grams: string,
    buttonLabel: string,
    nutrientContentFood: NutritionPerHectogram,
    onChangeGramsInput: (value: string) => void,
    onButtonPress: () => void
}

export const ConsumedFoodInput: React.FC<Props> = ({
    grams,
    onChangeGramsInput,
    nutrientContentFood,
    buttonLabel,
    onButtonPress
}) => {
    const gramsConsumedNutrientContent = calcMacroContentFoodPortion(Number(grams), nutrientContentFood)

    return (
        <View>
            <View style={styles.inputContainer} >
                <Text style={[styles.label, styles.margin]}>
                    Grams:
                </Text>
                <TextInput
                    style={[styles.input, styles.margin]}
                    placeholder=''
                    inputMode='decimal'
                    onChangeText={onChangeGramsInput}
                    value={grams}
                />
                <Button label={buttonLabel} onPress={onButtonPress} style={styles.button} />
            </View>
            <View style={styles.inputContainer}>
                <Text style={[styles.nutrientsText, styles.margin]}>
                    Protein: {gramsConsumedNutrientContent.gramsProtein}
                </Text>
                <Text style={[styles.nutrientsText, styles.margin]}>
                    Fat: {gramsConsumedNutrientContent.gramsFat}
                </Text>
                <Text style={[styles.nutrientsText, styles.margin]}>
                    Carbs: {gramsConsumedNutrientContent.gramsCarbs}
                </Text>
                <Text style={[styles.nutrientsText, styles.margin]}>
                    kJ: {gramsConsumedNutrientContent.kjEnergy}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    nutrientsText: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    margin: {
        marginLeft: 6,
        marginRight: 6
    },
    label: {
        fontSize: 18,
    },
    button: {
        flex: 0.5
    },
    input: {
        height: 30,
        padding: 5,
        borderWidth: 1,
        flex: 0.5
    }
})
