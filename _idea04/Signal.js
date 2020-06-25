const assert = require("assert");

module.exports = class Signal {

    constructor(from = [], to = []) {
        assert(Array.isArray(from) && Array.isArray(to));
        this.from = from;
        this.to = to;
        this.delay = 20;
        this.timeout = 2000;
        this.touched = new Set();
        this.queueCount = 0;
        this.callback = null;
    }

    start(values) {
        console.log("Signal#start", values);
        assert(this.from.length === values.length);
        this.from.forEach((neuron, index) => setImmediate(() => {
            this.queue(neuron, values[index]);
        }));
        let timer, promise = new Promise((resolve, reject) => {
            this.callback = resolve;
            timer = setTimeout(reject, this.timeout, "Signal timed out");
        });
        promise.then((result) => {
            clearTimeout(timer);
            return result;
        }).catch(console.error);
        return promise;
    }

    stop() {
        if (this.queueCount > 0) return;
        setTimeout(() => {
            let results = this.to.map(neuron => neuron.value);
            console.log("Signal#stop", results);
            this.callback(results);
        }, this.delay);
    }

    queue(neuron_or_axon, value) {
        this.queueCount++;
        setTimeout(() => {
            try { neuron_or_axon.compute(this, value); } catch (err) { }
            this.queueCount--;
            this.stop();
        }, this.delay * neuron_or_axon.inertia);
    }

}