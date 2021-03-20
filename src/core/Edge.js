/**
 * @module Edge 
 * @author Pfoerdie
 */

const
    _ = require("../tools"),
    _core = require("../core.js"),
    _private = new WeakMap(),
    _protected = _core.protected;

class Edge {

    /**
     * @param {object} [data=null] 
     * @param {Node} from 
     * @param {Node} to 
     * @constructs Edge 
     */
    constructor(data = null, from, to) {
        _.assert.Node(from);
        _.assert.Node(to);
        _private.set(this, { from, to, data });
        _protected.set(this, { target: new.target });
        _protected.get(from).edges.add(this);
        _.log(this, "constructor", data, from, to);
    }

    /**
     * @type {Node} 
     */
    get from() {
        _.assert.Edge(this);
        return _private.get(this).from;
    }

    /**
     * @type {Node} 
     */
    get to() {
        _.assert.Edge(this);
        return _private.get(this).to;
    }

    /**
     * @type {object} 
     */
    get data() {
        _.assert.Edge(this);
        return _private.get(this).data;
    }

    /**
     * @param {Message} msg 
     * @param {...*} args
     * @returns {undefined}
     */
    trigger(msg, ...args) {
        _.assert.Edge(this);
        _.assert.Message(msg);
        _.log(this, "trigger", msg);
        setImmediate(msg.transfer.bind(msg), this, ...args);
    }

    /**
     * @returns {boolean} 
     */
    update() {
        _.assert.Edge(this);
        _.log(this, "update", data);
        // TODO
        return false;
    }

    /**
     * @returns {boolean} 
     */
    remove() {
        _.assert.Edge(this);
        _.log(this, "remove");
        let { from } = _private.get(this);
        _private.remove(this);
        _protected.remove(this);
        _protected.get(from).edges.remove(this);
        return true;
    }

    static [Symbol.hasInstance](instance) {
        return _private.has(instance);
    }

}

module.exports = Edge;