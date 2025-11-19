import { View, Text, StyleSheet, Pressable, Alert, ScrollView } from "react-native";
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
            "Tem certeza?",
            "Uma vez adicionado, não é possível subtrair. Todos são zerados ao registrar uma confissão."
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
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
        >
            {pecados.map(([chave, descricao], index) => (
                <View key={chave} style={styles.itemPecado}>
                    <View style={styles.itemPecadoEsquerda}>
                        <Text style={styles.textBold}>
                            {descricao}
                        </Text>
                        <Text style={styles.textItemPecado}>
                            Quantidade atual: {getQuantidadePecado(chave)}
                        </Text>
                    </View>
                    <View style={styles.itemPecadoDireita}>
                        <Pressable style={styles.botaoAdicionar} onPress={() => adicionarPecado(chave)}>
                            <Text style={styles.text}>+</Text>
                        </Pressable>
                    </View>
                </View>
            ))}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    scrollContent: {
        alignItems: 'center',
        paddingVertical: 20, // Espaço no topo e base
    },
    divMetade: {
        width: '100%',
        height: '50%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontSize: 14,
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
        // height: 200,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 10,
        marginBottom: 14
    },
    botaoAdicionar: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textItemPecado: {
        fontSize: 14,
        color: 'white'
    },
    itemPecadoEsquerda: {
        width: '85%'
    },
    itemPecadoDireita: {
        width: '15%'
    },
    textBold: {
        fontFamily: 'OpenSansBold',
        color: 'white'
    }
});