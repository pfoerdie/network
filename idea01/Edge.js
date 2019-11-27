const
    _ = require("./tools"),
    _module = require("./module.js"),
    _private = new WeakMap();

class Edge {

    /**
     * Constructs an edge.
     * @param {Node} from 
     * @param {Node} to 
     * @param {*} data 
     * @constructs Edge 
     * @property {Node} from
     * @property {Node} to
     * @property {object} data
     */
    constructor(from, to, data = null) {
        _.assert(typeof data === "object", "data is not an object");
        _.assert(to instanceof _module.Node, "to is not a node");
        _.assert(from instanceof _module.Node, "from is not a node");
        _private.set(this, { data, from, to });
        _module.package.set(this, { target: new.target });
        _module.package.get(from).edges.add(this);
    }

    /**
     * Source of the edge.
     * @type {Node}
     */
    get from() {
        _.assert(this instanceof Edge, "this is not an edge");
        return _private.get(this).from;
    }

    /**
     * Target of the edge.
     * @type {Node}
     */
    get to() {
        _.assert(this instanceof Edge, "this is not an edge");
        return _private.get(this).to;
    }

    /**
     * Data of the edge.
     * @type {*}
     */
    get data() {
        _.assert(this instanceof Edge, "this is not an edge");
        return _private.get(this).data;
    }

    /**
     * Transfers a message, triggering processing of this edge. Eventually gets called after a node queued that message.
     * @param {Message} msg 
     * @interface
     */
    trigger(msg) {
        _.assert(this instanceof Edge, "this is not an edge");
        _.assert(msg instanceof _module.Message, "that is not a message");
        msg.process(this);
    }

    /**
     * Deletes an edge completely.
     * @returns {undefined}
     */
    delete() {
        _.assert(this instanceof Edge, "this is not an edge");
        _module.package.get(from).edges.delete(this);
        _module.package.delete(this);
        _private.delete(this);
    }

    static [Symbol.hasInstance](edge) {
        return _private.has(edge);
    }

}

module.exports = Edge;