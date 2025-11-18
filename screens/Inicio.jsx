import { View, Text, StyleSheet, Pressable } from "react-native";

export default function Inicio({ navigation }) {
    return (
        <View style={styles.container}>
            <View style={styles.divMetade}>
                <Text style={styles.titulo}>
                    Em estado de graça
                </Text>
            </View>
            <View style={styles.divMetade}>
                <Pressable
                    style={styles.botao}
                    onPress={() => navigation.navigate('Registrar_P')}
                >
                    <Text style={styles.text}>Registrar</Text>
                </Pressable>
                <Pressable
                    style={styles.botao}
                    onPress={() => navigation.navigate('Registrar_P')}
                >
                    <Text style={styles.text}>Registrar Confissão</Text>
                </Pressable>
                <Pressable
                    style={styles.botao}
                    onPress={() => navigation.navigate('Registrar_P')}
                >
                    <Text style={styles.text}>Gerenciar</Text>
                </Pressable>
                <Text style={styles.textoInformativo}>
                    Atenção: Para garantir a sua privacidade, todos os dados registrados no app são guardados em armazenamento local. Muito cuidado ao apagar este app ou formatar o seu celular.
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    divMetade: {
        width: '100%',
        height: '50%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontSize: 14,
        color: 'white'
    },
    titulo: {
        fontFamily: 'OpenSansBold',
        color: 'white',
        fontSize: 24
    },
    botao: {
        backgroundColor: 'black',
        borderColor: '#5d5d5d',
        borderWidth: 1,
        padding: 5,
        width: 250,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10
    },
    textoInformativo: {
        fontSize: 12,
        color: 'white',
        width: '90%',
        marginTop: 50,
    }
});