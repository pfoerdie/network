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
        this.data.nextValue = 0;
        this.emit($reset);
    },
    [$activate]: function (weightedValue) {
        this.data.nextValue += weightedValue;
    },
    [$iterate]: function () {
        let activation = Math.tanh(this.data.value - this.data.bias);
        // console.log(activation);
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
        for (let key of Reflect.ownKeys(_edgeEvents)) {
            this.on(key, _edgeEvents[key]);
        }
    } // Edge#constructor

} // Edge

class Neuron extends Node {

    constructor(bias = 1) {
        super({ bias, value: 0, nextValue: 0 });
        for (let key of Reflect.ownKeys(_neuronEvents)) {
            this.on(key, _neuronEvents[key]);
        }
    } // Neuron#constructor

    get value() {
        return this.data.value;
    } // Neuron#value<getter>

    set value(value) {
        if (typeof value === 'number') {
            this.data.value = value;
            this.data.nextValue = value;
        }
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

    cycle(time = 100) {
        return new Promise((resolve, reject) => {
            this.trigger($iterate);
            setTimeout(() => {
                this.trigger($update);
                setTimeout(() => {
                    resolve();
                }, time / 2);
            }, time / 2);
        });
    } // Neuron#cycle

} // Neuron

//#endregion CLASSES

module.exports = Neuron;