const
    _ = require("./tools"),
    _module = require("./module.js"),
    _private = new WeakMap();

class Node {

    /**
     * Constructs a node.
     * @param {*} [data=null] 
     * @constructs Node
     * @property {object} data
     */
    constructor(data = null) {
        _.assert(typeof data === "object", "data is not an object");
        _private.set(this, { data });
        _module.package.set(this, { target: new.target, edges: new Set() });
    }

    /**
     * Data of the node.
     * @type {*}
     */
    get data() {
        _.assert(this instanceof Node, "this is not a node");
        return _private.get(this).data;
    }

    /**
     * Queues a message to process for all edges.
     * @param {Message} msg 
     * @returns {undefined}
     */
    queue(msg) {
        _.assert(this instanceof Node, "this is not a node");
        _.assert(msg instanceof _module.Message, "that is not a message");
        _module.package.get(this).edges.forEach(edge => setImmediate(edge.transfer.bind(edge), msg));
    }

    emit(msg) {
        _.assert(this instanceof Node, "this is not a node");
        _.assert(msg instanceof _module.Message, "that is not a message");
        this.queue(msg);
    }

    /**
     * Deletes a node completely.
     * @returns {undefined}
     */
    delete() {
        _.assert(this instanceof Node, "this is not a node");
        _module.package.get(this).edges.clear();
        _module.package.delete(this);
        _private.delete(this);
    }

    static [Symbol.hasInstance](node) {
        return _private.has(node);
    }

}

module.exports = Node;