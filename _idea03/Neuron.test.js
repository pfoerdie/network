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
    neural_net.addInput(new Neuron(getRandom(0, 1), 0));
}

for (let i = 0; i < output_count; i++) {
    neural_net.addOutput(new Neuron(getRandom(0, 1), 0));
}

for (let i = 0; i < middle_count; i++) {
    let middle_node = new Neuron(getRandom(0, 1), 0);
    middle_layer.add(middle_node);
    neural_net.cacheNode(middle_node);
    for (let input of neural_net.inputs) {
        let input_edge = input.attach(middle_node, getRandom(-.2, .6));
    }
    for (let output of neural_net.outputs) {
        let output_edge = middle_node.attach(output, getRandom(-.2, .6));
    }
}

//#endregion

//#region process nodes with a basic activation function

function nodesToStr(iterator) {
    return Array.from(iterator).map(node => node.data.active ? "1" : "0").join(" ");
}

function printNet(time = 0) {
    if (time) console.log("________________________________________________________________________________");
    console.log(
        "TIME:\t\t" + time + " s" +
        "\ninputs:\t\t" + nodesToStr(neural_net.inputs) +
        "\nmiddle_layer:\t" + nodesToStr(middle_layer) +
        "\noutput:\t\t" + nodesToStr(neural_net.outputs)
    );
}

for (let input_node of neural_net.inputs) {
    input_node.activate(Math.random());
}

for (let delay of [0, .002, .01, .05, .1, .2, .3, .5, 1, 2]) {
    if (delay) setTimeout(printNet, delay * 1e3, delay);
    else printNet(delay);
}

//#endregion