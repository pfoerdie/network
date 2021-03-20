const _ = require("./tools.js");
const _module = require("./module.js");
const _private = new WeakMap();

class Node {

    /**
     * @param {object} [data=null] 
     * @constructs Node
     */
    constructor(data = null) {
        _.assert(typeof data === "object", "data is not an object");
        /** @type {Set<Edge>} */
        const inputs = new Set();
        /** @type {Map<Node, Edge>} */
        const outputs = new Map();
        _private.set(this, { uid: _module.generateUID(), inputs, outputs, data });
    }

    /**
     * @param {boolean<true>} confirm 
     * @returns {object}
     */
    delete(confirm = false) {
        _.assert(_private.has(this), "this is not a Node");
        _.assert(confirm === true, "confirm is not true");
        _private.get(this).inputs.forEach(input => input.delete(confirm));
        _private.get(this).outputs.forEach(output => output.delete(confirm));
        let data = _private.get(this).data;
        _private.delete(this);
        return data;
    }

    /** @type {String} */
    get uid() {
        _.assert(_private.has(this), "this is not a Node");
        return _private.get(this).uid;
    }

    /** @type {Iterator<Edge>} */ // TODO change it to an Iterator that does not expose the set itself
    get inputs() {
        _.assert(_private.has(this), "this is not a Node");
        return _private.get(this).inputs.values();
    }

    /** @type {Iterator<Edge>} */ // TODO change it to an Iterator that does not expose the set itself
    get outputs() {
        _.assert(_private.has(this), "this is not a Node");
        return _private.get(this).outputs.values();
    }

    /**
     * @param {Node} target 
     * @param {object} [data] 
     * @return {Edge}
     */
    attach(target, data) {
        _.assert(_private.has(this), "this is not a Node");
        _.assert(_private.has(target), "target is not a Node");
        _.assert(!_private.get(this).outputs.has(target), "target is already attached");
        let edge = new _module.Edge(this, target, data);
        _private.get(this).outputs.set(target, edge);
        _private.get(target).inputs.add(edge);
        return edge;
    }

    /**
     * @param {Node} target 
     * @return {boolean}
     */
    detach(target) {
        _.assert(_private.has(this), "this is not a Node");
        _.assert(_private.has(target), "target is not a Node");
        if (!_private.get(this).outputs.has(target)) return false;
        let edge = _private.get(this).outputs.get(target);
        _private.get(this).outputs.delete(target);
        _private.get(target).inputs.delete(edge);
        return true;
    }

    /** @type {object} */
    get data() {
        _.assert(_private.has(this), "this is not a Node");
        return _private.get(this).data;
    } set data(value) {
        _.assert(_private.has(this), "this is not a Node");
        _.assert(typeof value === "object", "value is not an object");
        _.assert(!_private.get(this).data, "this.data cannot be overridden");
        _private.get(this).data = value;
    }

    /**
     * @returns {Object}
     */
    toJSON() {
        return {
            type: "Node",
            uid: this.uid,
            inputs: Array.from(this.inputs).map(input => input.uid),
            outputs: Array.from(this.outputs).map(output => output.uid),
            data: this.data
        };
    }

} // Node

module.exports = Node;