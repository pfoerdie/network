const _ = require("../tools.js");
const _module = require("./module.js");

class Neuron extends _module.Node {

    constructor(bias = 0, value = 0) {
        _.assert(_.is.number(bias), "bias is not a number");
        _.assert(_.is.number(value), "value is not a number");
        const node_data = Object.create({}, {
            bias: {
                enumerable: true,
                get() {
                    return bias;
                }, set(val) {
                    _.assert(_.is.number(val), "bias is not a number");
                    bias = val;
                }
            },
            value: {
                enumerable: true,
                get() {
                    return value;
                }, set(val) {
                    _.assert(_.is.number(val), "value is not a number");
                    value = val;
                }
            }
        });
        super(node_data);
    }

    attach(neuron, weight = 0) {
        _.assert(neuron instanceof Neuron, "neuron is not a Neuron");
        _.assert(_.is.number(weight), "weight is not a number");
        const edge_data = Object.create({}, {
            weight: {
                enumerable: true,
                get() {
                    return weight;
                }, set(val) {
                    _.assert(_.is.number(val), "weight is not a number");
                    weight = val;
                }
            }
        });
        return super.attach(neuron, edge_data);
    }

    increase(amount) {
        _.assert(_.is.number(amount), "amount is not a number");
        this.data.value += amount;
    }

    activate(activation = Neuron.SIGMOID) {
        _.assert([Neuron.SIGMOID, Neuron.TANH].includes(activation), "activation is not a valid activation function");
        for (let edge of this.outputs) {
            edge.target.increase(edge.data.weight * activation(this.data.value - this.data.bias));
        }
    }

    static SIGMOID(val) {
        _.assert(_.is.number(val), "val is not a number");
        return 1 / (1 + Math.exp(-val));
    }

    static TANH(val) {
        _.assert(_.is.number(val), "val is not a number");
        return .5 + .5 * Math.tanh(val);
    }

} // Neuron

module.exports = Neuron;