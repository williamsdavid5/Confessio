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
                dataInicioSequencia: "",
                maximoDiasSemPecado: 0,
                diasSemPecado: 0
            }
        ],

        estatisticasPecados: [
            { chave: "primeiro", nome: "Amar a Deus sobre todas as coisas.", quantidade: 0, porcentagem: 0 },
            { chave: "segundo", nome: "Não tomar seu santo nome em vão.", quantidade: 0, porcentagem: 0 },
            { chave: "terceiro", nome: "Guardar domingos e festas.", quantidade: 0, porcentagem: 0 },
            { chave: "quarto", nome: "Honrar pai e mãe.", quantidade: 0, porcentagem: 0 },
            { chave: "quinto", nome: "Não matar.", quantidade: 0, porcentagem: 0 },
            { chave: "sexto", nome: "Não pecar contra a castidade.", quantidade: 0, porcentagem: 0 },
            { chave: "sétimo", nome: "Não furtar.", quantidade: 0, porcentagem: 0 },
            { chave: "oitavo", nome: "Não levantar falso testemunho.", quantidade: 0, porcentagem: 0 },
            { chave: "nono", nome: "Não desejar a mulher do próximo.", quantidade: 0, porcentagem: 0 },
            { chave: "décimo", nome: "Não cobiçar as coisas alheias.", quantidade: 0, porcentagem: 0 }
        ],
        historicoPecados: {
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
        }
    };

    // --------------------------------------------------------------

    static async load() {
        try {
            const json = await AsyncStorage.getItem(DataManager.STORAGE_KEY);

            if (!json) {
                const inicial = DataManager.estruturaInicial;
                inicial.basico[0].dataInicioSequencia = DataManager.getHoje();
                await AsyncStorage.setItem(DataManager.STORAGE_KEY, JSON.stringify(inicial));
                return inicial;
            }

            const dados = JSON.parse(json);

            dados.basico[0].maximoDiasSemPecado = dados.basico[0].maximoDiasSemPecado || 0;
            dados.basico[0].diasSemPecado = dados.basico[0].diasSemPecado || 0;

            if (!dados.historicoPecados) {
                dados.historicoPecados = { ...DataManager.estruturaInicial.historicoPecados };
            }

            if (dados.pecados && !dados.estatisticasPecados) {
                dados.estatisticasPecados = DataManager.estruturaInicial.estatisticasPecados.map(pecado => ({
                    ...pecado,
                    quantidade: dados.pecados[pecado.chave] || 0
                }));
                delete dados.pecados;
                delete dados.maisCometidos;
            }

            if (dados.basico[0].dataDiaSemPecado) {
                if (!dados.basico[0].dataInicioSequencia) {
                    dados.basico[0].dataInicioSequencia = dados.basico[0].dataDiaSemPecado;
                }
                delete dados.basico[0].dataDiaSemPecado;
            }

            if (!dados.basico[0].dataInicioSequencia && dados.basico[0].quantidadeGeral === 0) {
                dados.basico[0].dataInicioSequencia = DataManager.getHoje();
            }

            DataManager.atualizarQuantidadeGeral(dados);
            DataManager.atualizarDiasSemPecado(dados);
            DataManager.atualizarPorcentagens(dados);

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
            DataManager.atualizarDiasSemPecado(dados);
            DataManager.atualizarPorcentagens(dados);

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

            const pecadoIndex = dados.estatisticasPecados.findIndex(p => p.chave === tipoPecado);

            if (pecadoIndex !== -1) {

                dados.estatisticasPecados[pecadoIndex].quantidade += 1;

                dados.historicoPecados[tipoPecado] += 1;

                dados.basico[0].dataInicioSequencia = "";
                dados.basico[0].diasSemPecado = 0;

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
            const pecadoIndex = dados.estatisticasPecados.findIndex(p => p.chave === tipoPecado);

            if (pecadoIndex !== -1 && dados.estatisticasPecados[pecadoIndex].quantidade > 0) {
                dados.estatisticasPecados[pecadoIndex].quantidade -= 1;

                await DataManager.save(dados);
                return dados;
            }
            return dados;
        } catch (error) {
            console.error('Erro ao remover pecado:', error);
            return null;
        }
    }

    static async registrarConfissao() {
        try {
            const dados = await DataManager.load();

            dados.estatisticasPecados.forEach(pecado => {
                pecado.quantidade = 0;
            });

            dados.basico[0].dataInicioSequencia = DataManager.getHoje();
            dados.basico[0].diasSemPecado = 0;

            DataManager.atualizarDataUltimaConfissao(dados);

            await DataManager.save(dados);
            return dados;
        } catch (error) {
            console.error('Erro ao registrar confissão:', error);
            return null;
        }
    }

    static async zerarPecados() {
        try {
            const dados = await DataManager.load();

            dados.estatisticasPecados.forEach(pecado => {
                pecado.quantidade = 0;
            });

            dados.basico[0].dataInicioSequencia = DataManager.getHoje();
            dados.basico[0].diasSemPecado = 0;

            DataManager.atualizarDataUltimaConfissao(dados);

            await DataManager.save(dados);
            return dados;
        } catch (error) {
            console.error('Erro ao zerar pecados:', error);
            return null;
        }
    }

    // --------------------------------------------------------------

    static atualizarQuantidadeGeral(dados) {
        const soma = dados.estatisticasPecados.reduce((total, pecado) => total + pecado.quantidade, 0);
        dados.basico[0].quantidadeGeral = soma;
    }

    static atualizarDataUltimaConfissao(dados) {
        dados.basico[0].dataUltimaConfissao = DataManager.getHoje();
    }

    static atualizarPorcentagens(dados) {
        const totalHistorico = Object.values(dados.historicoPecados).reduce((a, b) => a + b, 0);

        dados.estatisticasPecados.forEach(pecado => {
            const quantidadeHistorico = dados.historicoPecados[pecado.chave] || 0;
            pecado.porcentagem = totalHistorico > 0 ?
                Math.round((quantidadeHistorico / totalHistorico) * 100) : 0;
        });

        dados.estatisticasPecados.sort((a, b) => {
            const historicoA = dados.historicoPecados[a.chave] || 0;
            const historicoB = dados.historicoPecados[b.chave] || 0;
            return historicoB - historicoA;
        });
    }

    static atualizarDiasSemPecado(dados) {
        if (dados.basico[0].quantidadeGeral === 0 && dados.basico[0].dataInicioSequencia) {
            const hoje = new Date();
            const dataInicio = new Date(dados.basico[0].dataInicioSequencia);

            const diffTime = hoje.getTime() - dataInicio.getTime();
            const diffDias = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            dados.basico[0].diasSemPecado = Math.max(0, diffDias);

            if (dados.basico[0].diasSemPecado > dados.basico[0].maximoDiasSemPecado) {
                dados.basico[0].maximoDiasSemPecado = dados.basico[0].diasSemPecado;
            }
        }
        else if (dados.basico[0].quantidadeGeral === 0 && !dados.basico[0].dataInicioSequencia) {
            dados.basico[0].dataInicioSequencia = DataManager.getHoje();
            dados.basico[0].diasSemPecado = 0;
        }
        else {
            dados.basico[0].diasSemPecado = 0;
        }
    }

    // --------------------------------------------------------------

    static getHoje() {
        const d = new Date();
        const offset = d.getTimezoneOffset();
        d.setMinutes(d.getMinutes() - offset);
        return d.toISOString().split("T")[0];
    }

    static getTop3MaisCometidos(dados) {
        return dados.estatisticasPecados.slice(0, 3);
    }

    static getPecadoPorChave(dados, chave) {
        return dados.estatisticasPecados.find(p => p.chave === chave);
    }

    //PARA DESENVOLVIMENTO
    static async editarDadosBasicos(novosDadosBasicos) {
        try {
            const dados = await DataManager.load();
            dados.basico[0] = { ...dados.basico[0], ...novosDadosBasicos };
            await DataManager.save(dados);
            return dados;
        } catch (error) {
            console.error('Erro ao editar dados básicos:', error);
            return null;
        }
    }

    static async editarQuantidadePecado(chave, novaQuantidade) {
        try {
            const dados = await DataManager.load();
            const pecadoIndex = dados.estatisticasPecados.findIndex(p => p.chave === chave);

            if (pecadoIndex !== -1) {
                dados.estatisticasPecados[pecadoIndex].quantidade = novaQuantidade;
                await DataManager.save(dados);
                return dados;
            }
            return null;
        } catch (error) {
            console.error('Erro ao editar quantidade de pecado:', error);
            return null;
        }
    }

    static async editarHistoricoPecado(chave, novaQuantidadeHistorico) {
        try {
            const dados = await DataManager.load();

            if (dados.historicoPecados[chave] !== undefined) {
                dados.historicoPecados[chave] = novaQuantidadeHistorico;
                await DataManager.save(dados);
                return dados;
            }
            return null;
        } catch (error) {
            console.error('Erro ao editar histórico de pecado:', error);
            return null;
        }
    }

    static async resetarTodosOsDados() {
        try {
            const dadosIniciais = DataManager.estruturaInicial;
            dadosIniciais.basico[0].dataInicioSequencia = DataManager.getHoje();
            await AsyncStorage.setItem(DataManager.STORAGE_KEY, JSON.stringify(dadosIniciais));
            return dadosIniciais;
        } catch (error) {
            console.error('Erro ao resetar dados:', error);
            return null;
        }
    }

    static async exportarDados() {
        try {
            const dados = await DataManager.load();
            return JSON.stringify(dados, null, 2);
        } catch (error) {
            console.error('Erro ao exportar dados:', error);
            return null;
        }
    }

    static async importarDados(jsonString) {
        try {
            const novosDados = JSON.parse(jsonString);
            await AsyncStorage.setItem(DataManager.STORAGE_KEY, JSON.stringify(novosDados));
            return novosDados;
        } catch (error) {
            console.error('Erro ao importar dados:', error);
            return null;
        }
    }
}
