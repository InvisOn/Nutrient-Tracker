import { StyleSheet } from 'react-native'
import { View } from '@/components/Themed'
import { InputFood } from '@/components/InputFood'
import { useLocalSearchParams } from 'expo-router'
import consoleLogClock from '@/utils/debug'

// ? should I addd this page to app/_layout.tsx?
const EditFoodPage: React.FC = () => {
    const params = useLocalSearchParams()

    consoleLogClock("rowID " + params.rowId)

    return (
        <View style={styles.container}>
            <InputFood
                valueProductName={String(params.productName)}
                valueGramProtein={String(params.gramProtein)}
                valueGramFat={String(params.gramFat)}
                valueGramCarbs={String(params.gramCarbs)}
                valueKjEnergy={String(params.kjEnergy)}
                onChangeTextProductName={(x) => consoleLogClock("onChangeTextProductName" + x)}
                onChangeTextGramProtein={(x) => consoleLogClock("onChangeTextGramProtein" + x)}
                onChangeTextGramFat={(x) => consoleLogClock("onChangeTextGramFat" + x)}
                onChangeTextGramCarbs={(x) => consoleLogClock("onChangeTextGramCarbs" + x)}
                onChangeTextKjEnergy={(x) => consoleLogClock("onChangeTextKjEnergy" + x)}
                buttonLabel={'EDIT INGREDIENT'}
                onButtonPress={() => consoleLogClock("onButtonPress editFoodPage")}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10
    }
})

export default EditFoodPage
