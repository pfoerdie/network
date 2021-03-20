const _ = require("./tools.js");
const _module = require("./module.js");
const _private = new WeakMap();

class Edge {

    /**
     * @param {Node} source 
     * @param {Node} target 
     * @param {object} [data=null] 
     * @constructs Edge
     */
    constructor(source, target, data = null) {
        _.assert(source instanceof _module.Node, "source is not a Node");
        _.assert(target instanceof _module.Node, "target is not a Node");
        _.assert(typeof data === "object", "data is not an object");
        _private.set(this, { uid: _module.generateUID(), source, target, data });
    }

    /**
     * @param {boolean<true>} confirm 
     * @returns {object}
     */
    delete(confirm = false) {
        _.assert(_private.has(this), "this is not an Edge");
        _.assert(confirm === true, "confirm is not true");
        _private.get(this).source.detach(_private.get(this).target);
        let data = _private.get(this).data;
        _private.delete(this);
        return data;
    }

    /** @type {String} */
    get uid() {
        _.assert(_private.has(this), "this is not an Edge");
        return _private.get(this).uid;
    }

    /** @type {Node} */
    get source() {
        _.assert(_private.has(this), "this is not an Edge");
        return _private.get(this).source;
    }

    /** @type {Node} */
    get target() {
        _.assert(_private.has(this), "this is not an Edge");
        return _private.get(this).target;
    }

    /** @type {object} */
    get data() {
        _.assert(_private.has(this), "this is not an Edge");
        return _private.get(this).data;
    }

    set data(value) {
        _.assert(_private.has(this), "this is not an Edge");
        _.assert(typeof value === "object", "value is not an object");
        _.assert(!_private.get(this).data, "this.data cannot be overridden");
        _private.get(this).data = value;
    }

    /**
     * @returns {Object}
     */
    toJSON() {
        return {
            type: "Edge",
            uid: this.uid,
            source: this.source.uid,
            target: this.target.uid,
            data: this.data
        };
    }

} // Node

module.exports = Edge;