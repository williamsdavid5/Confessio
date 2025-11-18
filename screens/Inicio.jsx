import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { useState, useEffect } from "react";
import LocalDB from '../services/LocalDB';

export default function Inicio({ navigation }) {

    const [dados, setDados] = useState();
    const [dataUltimaConfissao, setDataUltimaConfissao] = useState("");

    async function carregarDados() {
        try {
            const dadosBD = await LocalDB.load();
            setDados(dadosBD);
            setDataUltimaConfissao(formatarData(dadosBD?.basico[0]?.dataUltimaConfissao) || "Nunca");
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    }

    function formatarData(data) {
        if (!data) return "";

        const partes = data.split("-");
        if (partes.length !== 3) return data;

        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    useEffect(() => {
        carregarDados();
    }, []);

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


    async function registarConfissao() {
        const confirma = await mostrarConfirmacao(
            "Tem certeza?",
            "Ao registrar uma confissão, todos os pecados mortais serão zerados, isso não pode ser desfeito."
        )

        if (confirma) {
            try {
                await LocalDB.registrarConfissao();
            } catch (error) {
                console.error('Erro ao registrar confissão:', error);
            }
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.divMetade}>
                <Text style={styles.titulo}>
                    Em estado de graça
                </Text>
                <Text style={styles.text}>Última confissão: {dataUltimaConfissao}</Text>
                <Text style={styles.text}>Você está há {dados?.basico[0]?.diasSemPecado} dia(s) em estado de graça.</Text>
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
                    onPress={() => registarConfissao()}
                >
                    <Text style={styles.text}>Registrar Confissão</Text>
                </Pressable>
                <Pressable
                    style={styles.botao}
                    onPress={() => navigation.navigate('Gerenciar')}
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