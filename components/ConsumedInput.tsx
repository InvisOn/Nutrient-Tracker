import { StyleSheet, TextInput, useColorScheme } from 'react-native'
import { View, Text } from '@/components/Themed'
import Button from '@/components/Button'
import { Nutrition } from '@/types/Food'
import { calcNutritionContentFoodPortion } from '@/utils/food'

type Props = {
    grams: string,
    buttonLabel: string,
    nutritionContentFood: Nutrition,
    onChangeGramsInput: (value: string) => void,
    onButtonPress: () => void
}

// TODO: LOW PRIORITY fix spacing between nutrition appearing unequal
export const ConsumedFoodInput: React.FC<Props> = ({
    grams,
    onChangeGramsInput,
    nutritionContentFood,
    buttonLabel,
    onButtonPress
}) => {
    const gramsConsumedNutritionContentFoodPortion = calcNutritionContentFoodPortion(Number(grams), nutritionContentFood)

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        nutrientsText: {
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
            borderColor: '#fff',
            flex: 0.5,
            color: useColorScheme() === 'dark' ? '#fff' : '#000'
        }
    })

    return (
        <View>
            <View style={styles.container} >
                <Text style={[styles.label, styles.margin]}>
                    Grams:
                </Text>
                <TextInput
                    style={[styles.input, styles.margin]}
                    placeholder=''
                    inputMode='decimal'
                    onChangeText={onChangeGramsInput}
                    value={grams}
                    placeholderTextColor='#9a9a9a'
                />
                <Button label={buttonLabel} onPress={onButtonPress} style={styles.button} />
            </View>
            <View style={styles.container}>
                <Text style={[styles.nutrientsText, styles.margin]}>
                    Protein: {gramsConsumedNutritionContentFoodPortion.gramsProtein}
                </Text>
                <Text style={[styles.nutrientsText, styles.margin]}>
                    Fat: {gramsConsumedNutritionContentFoodPortion.gramsFat}
                </Text>
                <Text style={[styles.nutrientsText, styles.margin]}>
                    Carbs: {gramsConsumedNutritionContentFoodPortion.gramsCarbs}
                </Text>
                <Text style={[styles.nutrientsText, styles.margin]}>
                    kJ: {gramsConsumedNutritionContentFoodPortion.kjEnergy}
                </Text>
            </View>
        </View>
    )
}
