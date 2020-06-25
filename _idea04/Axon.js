const assert = require("assert");

module.exports = class Axon {

    constructor(source, target, weight = 0) {
        this.source = source;
        source.outputs.add(this);
        this.target = target;
        target.inputs.add(this);
        this.weight = weight;
        this.inertia = 1;
    }

    compute(signal, value) {
        console.log("Axon#compute", value);
        signal.queue(this.target, value - this.weight);
    }

}