const
    _ = require("./tools"),
    _module = require("./module.js"),
    _private = new WeakMap();

class Message {

    /**
     * Constructs a message.
     * @param {*} data 
     * @constructs Message
     * @property {object} data
     */
    constructor(data = null) {
        _.assert(typeof data === "object", "data is not an object");
        _private.set(this, { data, cache: new WeakMap() });
        _module.package.set(this, { target: new.target });
    }

    /**
     * Data of the message.
     * @type {*}
     */
    get data() {
        _.assert(this instanceof Message, "this is not a message");
        return _private.get(this).data;
    }

    /**
     * Processes an edge. Eventually gets called after an edge transfers this message.
     * @param {Edge} edge 
     * @interface
     */
    process(edge) {
        _.assert(this instanceof Message, "this is not a message");
        _.assert(edge instanceof Edge, "that is not an edge");
        edge.to.emit(this);
    }

    /**
     * Returns a cache object for any particular node.
     * @param {Node} node 
     * @returns {Object}
     */
    cache(node) {
        _.assert(this instanceof Message, "this is not a message");
        _.assert(node instanceof _module.Node, "that is not a node");
        let { cache } = _private.get(this);
        if (!cache.has(node)) cache.set(node, {});
        return cache.get(node);
        // TODO is this really useful?
    }

    /**
     * Deletes a message completely.
     * @returns {undefined}
     */
    delete() {
        _.assert(this instanceof Message, "this is not a message");
        _module.package.delete(this);
        _private.delete(this);
    }

    static [Symbol.hasInstance](msg) {
        return _private.has(msg);
    }

}

module.exports = Message;