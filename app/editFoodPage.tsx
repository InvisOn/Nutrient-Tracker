import { StyleSheet } from 'react-native';
import { View } from '@/components/Themed';
import { InputIngredients } from '@/components/InputNutrients';
import { useLocalSearchParams } from 'expo-router';
import consoleLogClock from '@/debug_utils';


const EditFoodPage: React.FC = () => {
    const params = useLocalSearchParams();

    return (
        <View style={styles.container}>
            <InputIngredients
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
                onButtonPress={() => consoleLogClock("onButtonPress")}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10
    }
});

export default EditFoodPage
