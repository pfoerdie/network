const { Network, Node, Edge, Neuron } = require(".");

//#region setup dense net with 1 middle layer and random inputs, biases and weights

const
    input_count = 16,
    middle_count = 25,
    output_count = 9,
    neural_net = new Network(),
    middle_layer = new Set();

function getRandom(min = 0, max = 1) {
    return min + (max - min) * Math.random();
}

for (let i = 0; i < input_count; i++) {
    neural_net.addInput(new Neuron(getRandom(0, 1), getRandom(0, 1)));
}

for (let i = 0; i < output_count; i++) {
    neural_net.addOutput(new Neuron(getRandom(0, 1), getRandom(0, 0)));
}

for (let i = 0; i < middle_count; i++) {
    let middle_node = new Neuron(getRandom(0, 1), getRandom(0, 0));
    middle_layer.add(middle_node);
    neural_net.cacheNode(middle_node);
    for (let input of neural_net.inputs) {
        let input_edge = input.attach(middle_node, getRandom(-.5, .5));
    }
    for (let output of neural_net.outputs) {
        let output_edge = middle_node.attach(output, getRandom(-.5, .5));
    }
}

//#endregion

//#region process nodes with a basic activation function

const ACTIVATION = Neuron.TANH;

function trimValue(value) {
    // return value;
    // return Math.round(1e2 * value) / 1e2;
    return Math.round(value);
}

function nodesToStr(iterator) {
    return Array.from(iterator).map(node => trimValue(ACTIVATION(node.data.value - node.data.bias))).join(" ");
}

for (let input_node of neural_net.inputs) { input_node.activate(ACTIVATION); }
for (let middle_node of middle_layer) { middle_node.activate(ACTIVATION); }

console.log("inputs:\t\t" + nodesToStr(neural_net.inputs));
console.log("middle_layer:\t" + nodesToStr(middle_layer));
console.log("output:\t\t" + nodesToStr(neural_net.outputs));

//#endregion