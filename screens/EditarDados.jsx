import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Alert } from "react-native";
import { useState, useEffect } from "react";
import LocalDB from '../services/LocalDB';

export default function EditarDados({ navigation }) {
    const [dados, setDados] = useState(null);
    const [jsonInput, setJsonInput] = useState("");

    // Estados para edição básica
    const [quantidadeGeral, setQuantidadeGeral] = useState("");
    const [diasSemPecado, setDiasSemPecado] = useState("");
    const [maximoDias, setMaximoDias] = useState("");
    const [dataSequencia, setDataSequencia] = useState("");
    const [dataConfissao, setDataConfissao] = useState("");

    async function carregarDados() {
        try {
            const dadosBD = await LocalDB.load();
            setDados(dadosBD);
            // Preenche os campos com os dados atuais
            if (dadosBD?.basico[0]) {
                setQuantidadeGeral(dadosBD.basico[0].quantidadeGeral.toString());
                setDiasSemPecado(dadosBD.basico[0].diasSemPecado.toString());
                setMaximoDias(dadosBD.basico[0].maximoDiasSemPecado.toString());
                setDataSequencia(dadosBD.basico[0].dataInicioSequencia || "");
                setDataConfissao(dadosBD.basico[0].dataUltimaConfissao || "");
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    }

    useEffect(() => {
        carregarDados();
    }, []);

    async function salvarDadosBasicos() {
        try {
            const novosDados = {
                quantidadeGeral: parseInt(quantidadeGeral) || 0,
                diasSemPecado: parseInt(diasSemPecado) || 0,
                maximoDiasSemPecado: parseInt(maximoDias) || 0,
                dataInicioSequencia: dataSequencia,
                dataUltimaConfissao: dataConfissao
            };

            const resultado = await LocalDB.editarDadosBasicos(novosDados);
            if (resultado) {
                setDados(resultado);
                Alert.alert("Sucesso", "Dados básicos atualizados!");
            }
        } catch (error) {
            Alert.alert("Erro", "Não foi possível salvar os dados");
        }
    }

    async function resetarDados() {
        Alert.alert(
            "Resetar Dados",
            "Tem certeza? Todos os dados serão perdidos!",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Resetar",
                    style: "destructive",
                    onPress: async () => {
                        const resultado = await LocalDB.resetarTodosOsDados();
                        if (resultado) {
                            setDados(resultado);
                            carregarDados();
                            Alert.alert("Sucesso", "Dados resetados!");
                        }
                    }
                }
            ]
        );
    }

    async function exportarDados() {
        const json = await LocalDB.exportarDados();
        if (json) {
            setJsonInput(json);
            Alert.alert("Sucesso", "Dados exportados para o campo abaixo!");
        }
    }

    async function importarDados() {
        if (!jsonInput.trim()) {
            Alert.alert("Erro", "Cole os dados JSON primeiro");
            return;
        }

        try {
            const resultado = await LocalDB.importarDados(jsonInput);
            if (resultado) {
                setDados(resultado);
                carregarDados();
                Alert.alert("Sucesso", "Dados importados!");
            }
        } catch (error) {
            Alert.alert("Erro", "JSON inválido");
        }
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.titulo}>Editor de Dados - Desenvolvimento</Text>

            {/* DADOS BÁSICOS */}
            <View style={styles.secao}>
                <Text style={styles.subtitulo}>Dados Básicos</Text>

                <View style={styles.campo}>
                    <Text style={styles.label}>Quantidade Geral:</Text>
                    <TextInput
                        style={styles.input}
                        value={quantidadeGeral}
                        onChangeText={setQuantidadeGeral}
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.campo}>
                    <Text style={styles.label}>Dias sem Pecado:</Text>
                    <TextInput
                        style={styles.input}
                        value={diasSemPecado}
                        onChangeText={setDiasSemPecado}
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.campo}>
                    <Text style={styles.label}>Máximo Dias:</Text>
                    <TextInput
                        style={styles.input}
                        value={maximoDias}
                        onChangeText={setMaximoDias}
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.campo}>
                    <Text style={styles.label}>Data Início Sequência:</Text>
                    <TextInput
                        style={styles.input}
                        value={dataSequencia}
                        onChangeText={setDataSequencia}
                        placeholder="YYYY-MM-DD"
                    />
                </View>

                <View style={styles.campo}>
                    <Text style={styles.label}>Data Última Confissão:</Text>
                    <TextInput
                        style={styles.input}
                        value={dataConfissao}
                        onChangeText={setDataConfissao}
                        placeholder="YYYY-MM-DD"
                    />
                </View>

                <Pressable style={styles.botao} onPress={salvarDadosBasicos}>
                    <Text style={styles.textoBotao}>Salvar Dados Básicos</Text>
                </Pressable>
            </View>

            {/* PECADOS ATUAIS */}
            <View style={styles.secao}>
                <Text style={styles.subtitulo}>Pecados Atuais</Text>
                {dados?.estatisticasPecados?.map((pecado, index) => (
                    <View key={pecado.chave} style={styles.campoPecado}>
                        <Text style={styles.labelPecado}>{pecado.nome}</Text>
                        <Text style={styles.textoPequeno}>Atual: {pecado.quantidade} | Histórico: {dados?.historicoPecados?.[pecado.chave] || 0}</Text>
                    </View>
                ))}
            </View>

            {/* EXPORTAR/IMPORTAR */}
            <View style={styles.secao}>
                <Text style={styles.subtitulo}>Exportar/Importar</Text>

                <Pressable style={styles.botao} onPress={exportarDados}>
                    <Text style={styles.textoBotao}>Exportar Dados (JSON)</Text>
                </Pressable>

                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={jsonInput}
                    onChangeText={setJsonInput}
                    multiline
                    numberOfLines={10}
                    placeholder="Cole os dados JSON aqui..."
                />

                <Pressable style={styles.botao} onPress={importarDados}>
                    <Text style={styles.textoBotao}>Importar Dados</Text>
                </Pressable>
            </View>

            {/* RESETAR */}
            <View style={styles.secao}>
                <Text style={styles.subtitulo}>Ações Perigosas</Text>
                <Pressable style={[styles.botao, styles.botaoPerigoso]} onPress={resetarDados}>
                    <Text style={styles.textoBotao}>RESETAR TODOS OS DADOS</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    scrollContent: {
        padding: 20,
    },
    titulo: {
        fontSize: 20,
        color: 'white',
        fontFamily: 'OpenSansBold',
        textAlign: 'center',
        marginBottom: 20,
    },
    subtitulo: {
        fontSize: 16,
        color: 'white',
        fontFamily: 'OpenSansBold',
        marginBottom: 10,
    },
    secao: {
        backgroundColor: '#1a1a1a',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#333',
    },
    campo: {
        marginBottom: 10,
    },
    campoPecado: {
        marginBottom: 8,
        padding: 8,
        backgroundColor: '#2a2a2a',
        borderRadius: 4,
    },
    label: {
        color: 'white',
        fontSize: 14,
        marginBottom: 5,
    },
    labelPecado: {
        color: 'white',
        fontSize: 12,
        fontFamily: 'OpenSansBold',
    },
    textoPequeno: {
        color: '#ccc',
        fontSize: 10,
    },
    input: {
        backgroundColor: '#2a2a2a',
        color: 'white',
        padding: 10,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#444',
    },
    textArea: {
        minHeight: 120,
        textAlignVertical: 'top',
        marginVertical: 10,
    },
    botao: {
        backgroundColor: '#333',
        padding: 12,
        borderRadius: 4,
        alignItems: 'center',
        marginVertical: 5,
    },
    botaoPerigoso: {
        backgroundColor: '#8B0000',
    },
    textoBotao: {
        color: 'white',
        fontSize: 14,
        fontFamily: 'OpenSansBold',
    },
});