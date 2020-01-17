const _ = require("../tools.js");
const _module = require("./module.js");
const _private = new WeakMap();

class Network {

    constructor() {
        /** @type {Set<Node>} */
        const cache = new Set();
        /** @type {Set<Node>} */
        const inputs = new Set();
        /** @type {Set<Node>} */
        const outputs = new Set();
        _private.set(this, { uid: _module.generateUID(), cache, inputs, outputs });
    }

    /**
     * @param {boolean<true>} confirm 
     * @returns {undefined}
     */
    delete(confirm = false) {
        _.assert(_private.has(this), "this is not a Network");
        _.assert(confirm === true, "confirm is not true");
        _private.delete(this);
    }

    /** @type {String} */
    get uid() {
        _.assert(_private.has(this), "this is not a Network");
        return _private.get(this).uid;
    }

    /** @type {Iterator<Node>} */ // TODO change it to an Iterator that does not expose the set itself
    get cache() {
        _.assert(_private.has(this), "this is not a Network");
        return _private.get(this).cache.values();
    }

    /**
     * @param {Node} node 
     * @returns {undefined}
     */
    cacheNode(node) {
        _.assert(_private.has(this), "this is not a Network");
        _.assert(node instanceof _module.Node, "node is not a Node");
        _private.get(this).cache.add(node);
    }

    /**
     * @param {Node} node 
     * @returns {undefined}
     */
    removeNode(node) {
        _.assert(_private.has(this), "this is not a Network");
        _.assert(node instanceof _module.Node, "node is not a Node");
        if (!_private.get(this).cache.delete(node)) return false;
        _private.get(this).inputs.delete(node);
        _private.get(this).outputs.delete(node);
        return true;
    }

    /** @type {Iterator<Node>} */ // TODO change it to an Iterator that does not expose the set itself
    get inputs() {
        _.assert(_private.has(this), "this is not a Network");
        return _private.get(this).inputs.values();
    }

    /**
     * @param {Node} input 
     * @returns {undefined}
     */
    addInput(input) {
        _.assert(_private.has(this), "this is not a Network");
        _.assert(input instanceof _module.Node, "input is not a Node");
        _private.get(this).inputs.add(input);
        _private.get(this).cache.add(input);
    }

    /**
     * @param {Node} input 
     * @returns {boolean}
     */
    removeInput(input) {
        _.assert(_private.has(this), "this is not a Network");
        _.assert(input instanceof _module.Node, "input is not a Node");
        return _private.get(this).inputs.delete(input);
    }

    /** @type {Iterator<Node>} */ // TODO change it to an Iterator that does not expose the set itself
    get outputs() {
        _.assert(_private.has(this), "this is not a Network");
        return _private.get(this).outputs.values();
    }

    /**
     * @param {Node} output 
     * @returns {undefined}
     */
    addOutput(output) {
        _.assert(_private.has(this), "this is not a Network");
        _.assert(output instanceof _module.Node, "output is not a Node");
        _private.get(this).outputs.add(output);
        _private.get(this).cache.add(output);
    }

    /**
     * @param {Node} output 
     * @returns {boolean}
     */
    removeOutput(output) {
        _.assert(_private.has(this), "this is not a Network");
        _.assert(output instanceof _module.Node, "output is not a Node");
        return _private.get(this).outputs.delete(output);
    }

    /**
     * @returns {Object}
     */
    toJSON() {
        return {
            type: "Network",
            uid: this.uid,
            cache: Array.from(this.cache).map(node => node.uid),
            inputs: Array.from(this.inputs).map(input => input.uid),
            outputs: Array.from(this.outputs).map(output => output.uid)
        };
    }

} // Network

module.exports = Network;