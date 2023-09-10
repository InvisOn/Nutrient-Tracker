import { StyleSheet } from 'react-native';
import { View } from '@/components/Themed';
import { InputIngredients } from '@/components/InputNutrients';
import { useState } from 'react';

export default function EditIngredientPage() {
    const [productName, setProductName] = useState<string | number>('')
    const [gramProtein, setProtein] = useState<string | number>('')
    const [gramFat, setFat] = useState<string | number>('')
    const [gramCarbs, setCarbs] = useState<string | number>('')
    const [kjEnergy, setEnergy] = useState<string | number>('')

    const editIngredient = () => {

    }

    return (
        <View style={styles.container}>
            <InputIngredients
                valueProductName={String(productName)}
                valueGramProtein={String(gramProtein)}
                valueGramFat={String(gramFat)}
                valueGramCarbs={String(gramCarbs)}
                valueKjEnergy={String(kjEnergy)}
                onChangeTextProductName={setProductName}
                onChangeTextGramProtein={setProtein}
                onChangeTextGramFat={setFat}
                onChangeTextGramCarbs={setCarbs}
                onChangeTextKjEnergy={setEnergy}
                buttonLabel={'EDIT INGREDIENT'}
                onButtonPress={editIngredient}
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
