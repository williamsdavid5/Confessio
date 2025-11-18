import { View, Text, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import LocalDB from '../services/LocalDB';

export default function Gerenciar({ navigation }) {

    const [dados, setDados] = useState();

    async function carregarDados() {
        try {
            const dadosBD = await LocalDB.load();
            setDados(dadosBD);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    }

    useEffect(() => {
        carregarDados();
    }, []);

    function formatarData(data) {
        if (!data) return "";

        const partes = data.split("-");
        if (partes.length !== 3) return data;

        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    return (
        <View style={styles.container}>
            <View style={styles.divMetade}>
                <View style={styles.bloco}>
                    <Text style={styles.text}>Pendentes</Text>
                    <Text style={styles.numeroBlocco}>{dados?.basico[0]?.quantidadeGeral}</Text>
                </View>
                <View style={styles.bloco}>
                    <Text style={styles.text}>Dias em estado de graça</Text>
                    <Text style={styles.numeroBlocco}>{dados?.basico[0]?.diasSemPecado}</Text>
                </View>
            </View>
            <View style={styles.blocoCompleto}>
                <Text style={styles.text}>Ultima confissão: {formatarData(dados?.basico[0]?.dataUltimaConfissao)}</Text>
                <Text style={styles.titulo}>Seu máximo: {dados?.basico[0]?.maximoDiasSemPecado} dia(s)</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
    },
    text: {
        fontSize: 14,
        color: 'white'
    },
    titulo: {
        fontFamily: 'OpenSansBold',
        fontSize: 25,
        color: 'white'
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
    textBold: {
        fontFamily: 'OpenSansBold',
        color: 'white'
    },
    divMetade: {
        width: '90%',
        height: '20%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        marginBottom: 10,
        // backgroundColor: 'red'
    },
    bloco: {
        borderColor: '#5d5d5d',
        borderWidth: 1,
        padding: 10,
        flex: 1
    },
    blocoCompleto: {
        borderColor: '#5d5d5d',
        borderWidth: 1,
        padding: 10,
        width: '90%'
    },
    numeroBlocco: {
        fontSize: 80,
        color: 'white',
        flex: 1,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: 'OpenSansBold'
    }
});