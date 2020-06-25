const assert = require("assert");

module.exports = class Neuron {

    constructor(bias = 0) {
        this.bias = bias;
        this.value = 0;
        this.inertia = 1;
        this.inputs = new Set();
        this.outputs = new Set();
    }

    compute(signal, value) {
        console.log("Neuron#compute", value);
        for (let axon of this.outputs) {
            signal.queue(axon, value + this.bias);
        }
    }

}