const { Network, Node, Edge } = require(".");

//#region setup dense net with 1 middle layer and random inputs, biases and weights

const
    input_count = 16,
    middle_count = 25,
    output_count = 9,
    neural_net = new Network(),
    middle_layer = new Set();

for (let i = 0; i < input_count; i++) {
    neural_net.addInput(new Node({ bias: Math.random(), value: Math.random() }));
}

for (let i = 0; i < output_count; i++) {
    neural_net.addOutput(new Node({ bias: Math.random(), value: 0 }));
}

for (let i = 0; i < middle_count; i++) {
    let middle_node = new Node({ bias: Math.random(), value: 0 });
    middle_layer.add(middle_node);
    neural_net.cacheNode(middle_node);
    for (let input of neural_net.inputs) {
        let input_edge = input.attach(middle_node, { weight: Math.random() - .5 });
    }
    for (let output of neural_net.outputs) {
        let output_edge = middle_node.attach(output, { weight: Math.random() - .5 });
    }
}

//#endregion

//#region process nodes with a basic activation function

function activation(bias, value) {
    return value < bias ? 0 : 1;
}

function processNode(node) {
    for (let output_edge of node.outputs) {
        processWeight(output_edge, activation(node.data.bias, node.data.value));
    }
}

function processWeight(edge, value) {
    edge.target.data.value += edge.data.weight * value;
}

for (let input_node of neural_net.inputs) {
    processNode(input_node);
}

for (let middle_node of middle_layer) {
    processNode(middle_node);
}

console.log("inputs:\t\t" + Array
    .from(neural_net.inputs)
    .map(input_node => activation(input_node.data.bias, input_node.data.value))
    .join(" ")
);

console.log("middle_layer:\t" + Array
    .from(middle_layer)
    .map(middle_node => activation(middle_node.data.bias, middle_node.data.value))
    .join(" ")
);

console.log("output:\t\t" + Array
    .from(neural_net.outputs)
    .map(output_node => activation(output_node.data.bias, output_node.data.value))
    .join(" ")
);

//#endregion