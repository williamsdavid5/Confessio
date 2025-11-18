import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import LocalDB from '../services/LocalDB';
import { useState, useEffect } from "react";

export default function Registros_P({ navigation }) {

    const [pecados, setPecados] = useState([]);
    const [dados, setDados] = useState();

    async function carregarDados() {
        try {
            const lista = Object.entries(LocalDB.mandatoPorPecado);
            const dadosBD = await LocalDB.load();
            setDados(dadosBD);
            setPecados(lista);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    }

    async function adicionarPecado(tipoPecado) {

        const confirma = await mostrarConfirmacao(
            "Confirme",
            "Uma vez adicionado, só é removido na confissã. Tem certeza que quer adicionar?"
        )

        if (confirma) {
            try {
                const novosDados = await LocalDB.adicionarPecado(tipoPecado);
                if (novosDados) {
                    setDados(novosDados);
                }
            } catch (error) {
                console.error('Erro ao adicionar pecado:', error);
                Alert.alert('Erro', 'Não foi possível adicionar o pecado');
            }
        }
    }

    function getQuantidadePecado(tipoPecado) {
        return dados?.pecados?.[tipoPecado] ?? 0;
    }

    function mostrarConfirmacao(titulo, mensagem) {
        return new Promise((resolve) => {
            Alert.alert(
                titulo,
                mensagem,
                [
                    {
                        text: "Não",
                        style: "cancel",
                        onPress: () => resolve(false)
                    },
                    {
                        text: "Sim",
                        onPress: () => resolve(true)
                    }
                ],
                { cancelable: false }
            );
        });
    }

    const nomeParaChave = {
        "primeiro": "primeiro",
        "segundo": "segundo",
        "terceiro": "terceiro",
        "quarto": "quarto",
        "quinto": "quinto",
        "sexto": "sexto",
        "sétimo": "sétimo",
        "oitavo": "oitavo",
        "nono": "nono",
        "décimo": "décimo"
    };


    useEffect(() => {
        carregarDados();
    }, []);


    return (
        <View style={styles.container}>
            <Pressable style={styles.botao} onPress={() => navigation.goBack()}>
                <Text style={styles.text}>Voltar</Text>
            </Pressable>
            <View style={styles.itemPecado}>
                <Text style={styles.text}>
                    {pecados[0]?.[1]}
                    Quantidade: {getQuantidadePecado("primeiro")}
                </Text>
                <Pressable style={styles.botaoAdicionar} onPress={() => adicionarPecado("primeiro")}>
                    <Text style={styles.text}>+</Text>
                </Pressable>
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
        alignItems: 'center',
        justifyContent: 'center'
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
        margin: 10
    },
    itemPecado: {
        backgroundColor: 'black',
        borderColor: '#5d5d5d',
        borderWidth: 1,
        width: '90%',
        height: 60,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 10
    },
    botaoAdicionar: {
        width: 40,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    }
});