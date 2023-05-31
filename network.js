// Classe NeuralNetwork representa uma rede neural
class NeuralNetwork {
    // Construtor da classe
    constructor(neuronCounts) {
        this.levels = [];

        // Cria as camadas da rede neural com base no número de neurônios em cada camada
        for (let i = 0; i < neuronCounts.length - 1; i++) {
            this.levels.push(new Level(neuronCounts[i], neuronCounts[i + 1]));
        }
    }

    // Método estático que realiza a propagação dos valores de entrada pela rede neural
    static feedForward(givenInputs, network) {
        let outputs = Level.feedForward(givenInputs, network.levels[0]);

        // Propaga os valores de saída de uma camada para a próxima
        for (let i = 1; i < network.levels.length; i++) {
            outputs = Level.feedForward(outputs, network.levels[i]);
        }

        return outputs;
    }

    // Método estático que realiza a mutação da rede neural
    static mutate(network, amount = 1) {
        network.levels.forEach((level) => {
            // Altera os valores dos bias (limiar de ativação) dos neurônios
            for (let i = 0; i < level.biases.length; i++) {
                level.biases[i] = lerp(level.biases[i], Math.random() * 2 - 1, amount);
            }

            // Altera os pesos sinápticos das conexões entre neurônios
            for (let i = 0; i < level.weights.length; i++) {
                for (let j = 0; j < level.weights[i].length; j++) {
                    level.weights[i][j] = lerp(level.weights[i][j], Math.random() * 2 - 1, amount);
                }
            }
        });
    }
}

// Classe Level representa uma camada da rede neural
class Level {
    // Construtor da classe
    constructor(inputCount, outputCount) {
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        this.biases = new Array(outputCount);
        this.weights = [];

        // Cria a matriz de pesos sinápticos com base no número de entradas e saídas
        for (let i = 0; i < inputCount; i++) {
            this.weights[i] = new Array(outputCount);
        }

        Level.randomize(this);
    }

    // Método estático para inicializar aleatoriamente os pesos e os biases de uma camada
    static randomize(level) {
        for (let i = 0; i < level.inputs.length; i++) {
            for (let j = 0; j < level.outputs.length; j++) {
                level.weights[i][j] = Math.random() * 2 - 1;
            }
        }

        for (let i = 0; i < level.biases.length; i++) {
            level.biases[i] = Math.random() * 2 - 1;
        }
    }

    // Método estático que realiza a propagação dos valores de entrada pela camada
    static feedForward(givenInputs, level) {
        // Copia os valores de entrada para o array de inputs da camada
        for (let i = 0; i < level.inputs.length; i++) {
            level.inputs[i] = givenInputs[i];
        }

        // Realiza o cálculo da saída de cada neurônio da camada
        for (let i = 0; i < level.outputs.length; i++) {
            let sum = 0;

            // Calcula a soma ponderada das entradas multiplicadas pelos pesos sinápticos
            for (let j = 0; j < level.inputs.length; j++) {
                sum += level.inputs[j] * level.weights[j][i];
            }

            // Aplica a função de ativação (limiar de ativação)
            if (sum > level.biases[i]) {
                level.outputs[i] = 1;
            } else {
                level.outputs[i] = 0;
            }
        }

        return level.outputs;
    }
}
