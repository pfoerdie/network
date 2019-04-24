//#region CONSTANTS

const
    Node = require('./Node.js');

const
    $reset = Symbol(),
    $activate = Symbol(),
    $update = Symbol(),
    $iterate = Symbol();

const _edgeEvents = {
    [$reset]: function () {
        this.emit($reset);
    },
    [$activate]: function (value) {
        let weightedValue = this.data.weight * value;
        this.emit($activate, weightedValue);
    },
    [$iterate]: function () {
        this.emit($iterate);
    },
    [$update]: function () {
        this.emit($update);
    }
}; // _edgeEvents

const _neuronEvents = {
    [$reset]: function () {
        this.data.value = 0;
        this.emit($reset);
    },
    [$activate]: function (weightedValue) {
        this.data.nextValue += weightedValue;
    },
    [$iterate]: function () {
        let activation = Math.tanh(this.data.value - this.data.bias);
        this.emit($activate, activation);
        this.emit($iterate);
    },
    [$update]: function () {
        this.data.value = this.data.nextValue;
        this.emit($update);
    }
}; // _neuronEvents

//#endregion CONSTANTS

//#region CLASSES

class Edge extends Node {

    constructor(weight = 0) {
        super({ weight });
        for (let key of Object.keys(_edgeEvents)) {
            this.on(key, _edgeEvents[key]);
        }
    } // Edge#constructor

} // Edge

class Neuron extends Node {

    constructor(bias = 0) {
        super({ bias, value: 0, nextValue: 0 });
        for (let key of Object.keys(_neuronEvents)) {
            this.on(key, _neuronEvents[key]);
        }
    } // Neuron#constructor

    get value() {
        return this.data.value;
    } // Neuron#value<getter>

    set value(value) {
        if (typeof value === 'number')
            this.data.value = value;
    } // Neuron#value<setter>

    attach(node, weight) {
        if (node instanceof Neuron) {
            let edge = new Edge(weight);
            super.attach(edge);
            edge.attach(node);
        } else {
            super.attach(node);
        }
        return this;
    } // Neuron#attach

    cycle() {
        return new Promise((resolve, reject) => {
            this.trigger($activate);
            setTimeout(() => {
                this.trigger($iterate);
                setTimeout(() => {
                    this.trigger($update);
                    setTimeout(() => {
                        resolve();
                    }, 100);
                }, 100);
            }, 100);
        });
    } // Neuron#cycle

} // Neuron

//#endregion CLASSES

module.exports = Neuron;