class NeuralNet {
    constructor(layers, initialValue) {
        this.layers = new Array(layers.length)

        for (let i = 0; i < layers.length; i++) {
            this.layers[i] = new Array(layers[i])
            for (let k = 0; k < layers[i]; k++) {
                let weights = null
                if (i > 0) {
                    weights = new Array(layers[i - 1])
                    for (let w = 0; w < layers[i - 1]; w++) {
                        weights[w] = initialValue()
                    }
                }
                this.layers[i][k] = {
                    weights: weights,
                    value: 0
                }
            }
        }
    }

    setLayers(layers) {
        this.layers = layers
    }

    getOutput(index) {
        return this.layers[this.layers.length - 1][index].value
    }

    setInputArray(input) {
        for (let i = 0; i < this.layers[0].length && i < input.length; i++) {
            this.layers[0][i].value = input[i];
        }
    }

    update() {
        for (let i = 1; i < this.layers.length; i++) {
            let prevLayer = this.layers[i - 1];
            let currLayer = this.layers[i];
            for (let n = 0; n < currLayer.length; n++) {
                let node = currLayer[n];
                node.value = 0;
                for (let k = 0; k < node.weights.length; k++) {
                    node.value += node.weights[k] * prevLayer[k].value;
                }

                node.value = node.value / (1 + abs(node.value))
            }
        }
    }

    setParents(p1, p2, randomnes) {
        for (let i = 1; i < this.layers.length; i++) {
            let layer = this.layers[i]
            let p1Layer = p1.layers[i]
            let p2Layer = p2.layers[i]

            for (let k = 0; k < layer.length; k++) {
                let node = layer[k]
                let p1Node = p1Layer[k]
                let p2Node = p2Layer[k]

                for (let w = 0; w < node.weights.length; w++) {
                    node.weights[w] = (p1Node.weights[w] + p2Node.weights[w]) * 0.5 + (random() * 2 - 1) * randomnes
                }
            }
        }
    }
}
