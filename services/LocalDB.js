import AsyncStorage from '@react-native-async-storage/async-storage';

export default class DataManager {
    static STORAGE_KEY = '@dadosApp';

    static mandatoPorPecado = {
        primeiro: "Amar a Deus sobre todas as coisas.",
        segundo: "Não tomar seu santo nome em vão.",
        terceiro: "Guardar domingos e festas.",
        quarto: "Honrar pai e mãe.",
        quinto: "Não matar.",
        sexto: "Não pecar contra a castidade.",
        sétimo: "Não furtar.",
        oitavo: "Não levantar falso testemunho.",
        nono: "Não desejar a mulher do próximo.",
        décimo: "Não cobiçar as coisas alheias."
    };

    static estruturaInicial = {
        basico: [
            {
                quantidadeGeral: 0,
                dataUltimaConfissao: "",
                dataDiaSemPecado: ""
            }
        ],
        pecados: {
            primeiro: 0,
            segundo: 0,
            terceiro: 0,
            quarto: 0,
            quinto: 0,
            sexto: 0,
            sétimo: 0,
            oitavo: 0,
            nono: 0,
            décimo: 0
        },
        maisCometidos: [
            { referente: "vazio", quantidade: 0 },
            { referente: "vazio", quantidade: 0 },
            { referente: "vazio", quantidade: 0 }
        ]
    };

    // --------------------------------------------------------------

    static async load() {
        try {
            const json = await AsyncStorage.getItem(DataManager.STORAGE_KEY);

            if (!json) {
                const inicial = DataManager.estruturaInicial;
                inicial.basico[0].dataDiaSemPecado = DataManager.getHoje();
                await AsyncStorage.setItem(DataManager.STORAGE_KEY, JSON.stringify(inicial));
                return inicial;
            }

            const dados = JSON.parse(json);

            DataManager.atualizarQuantidadeGeral(dados);

            DataManager.atualizarDataDiaSemPecado(dados);

            DataManager.atualizarMaisCometidos(dados);

            await AsyncStorage.setItem(DataManager.STORAGE_KEY, JSON.stringify(dados));

            return dados;
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            return DataManager.estruturaInicial;
        }
    }

    // --------------------------------------------------------------

    static async save(dados) {
        try {
            DataManager.atualizarQuantidadeGeral(dados);
            DataManager.atualizarDataDiaSemPecado(dados);
            DataManager.atualizarMaisCometidos(dados);

            await AsyncStorage.setItem(DataManager.STORAGE_KEY, JSON.stringify(dados));
            return true;
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
            return false;
        }
    }

    // --------------------------------------------------------------
    static async adicionarPecado(tipoPecado) {
        try {
            const dados = await DataManager.load();

            if (dados.pecados[tipoPecado] !== undefined) {
                dados.pecados[tipoPecado] += 1;

                await DataManager.save(dados);
                return dados;
            } else {
                console.error('Tipo de pecado não encontrado:', tipoPecado);
                return null;
            }
        } catch (error) {
            console.error('Erro ao adicionar pecado:', error);
            return null;
        }
    }

    static async removerPecado(tipoPecado) {
        try {
            const dados = await DataManager.load();

            if (dados.pecados[tipoPecado] !== undefined && dados.pecados[tipoPecado] > 0) {
                dados.pecados[tipoPecado] -= 1;

                await DataManager.save(dados);
                return dados;
            }
            return dados;
        } catch (error) {
            console.error('Erro ao remover pecado:', error);
            return null;
        }
    }

    static async zerarPecados() {
        try {
            const dados = await DataManager.load();

            Object.keys(dados.pecados).forEach(key => {
                dados.pecados[key] = 0;
            });

            await DataManager.save(dados);
            return dados;
        } catch (error) {
            console.error('Erro ao zerar pecados:', error);
            return null;
        }
    }

    // --------------------------------------------------------------

    static atualizarQuantidadeGeral(dados) {
        const soma = Object.values(dados.pecados).reduce((a, b) => a + b, 0);
        dados.basico[0].quantidadeGeral = soma;
    }

    static atualizarDataDiaSemPecado(dados) {
        if (dados.basico[0].quantidadeGeral === 0) {
            dados.basico[0].dataDiaSemPecado = DataManager.getHoje();
        }
    }

    static atualizarMaisCometidos(dados) {
        const lista = Object.entries(dados.pecados)
            .map(([pecado, quantidade]) => ({
                referente: DataManager.mandatoPorPecado[pecado],
                quantidade
            }))
            .sort((a, b) => b.quantidade - a.quantidade)
            .slice(0, 3);

        dados.maisCometidos = lista;
    }

    // --------------------------------------------------------------

    static getHoje() {
        const d = new Date();
        return d.toISOString().split("T")[0];
    }
}