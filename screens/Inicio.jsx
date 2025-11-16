import { View, Text, StyleSheet, Pressable } from "react-native";
import { Button } from "react-native-web";

export default function ({ navigation }) {
    return (
        <View style={styles.container}>
            <h1 style={styles.titulo}>
                Tudo tranquilo
            </h1>
            <Button
                style={styles.botao}
                title="Registro p"
                onPress={() => navigation.navigate('Registrar_P')}
            ></Button>
            <Pressable
                style={styles.botao}
            >
                <Text style={styles.text}>Ir para registros</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
    },
    text: {
        fontSize: 18,
        color: 'white'
    },
    titulo: {
        fontFamily: 'OpenSans'
    },
    botao: {
        backgroundColor: 'black',
        color: 'white',
        borderColor: '#007BFF',
    }
});