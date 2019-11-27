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
     * @param {Node} from 
     * @param {Node} to 
     * @param {object} [data=null] 
     * @constructs Edge 
     */
    constructor(from, to, data = null) {
        _.assert.Node(from);
        _.assert.Node(to);
        _private.set(this, { from, to, data });
        _protected.set(this, { target: new.target });
        _protected.get(from).edges.add(this);
        _.log(this, "constructor", data);
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

    trigger(msg) {
        _.assert.Edge(this);
        _.assert.Message(msg);
        _.log(this, "trigger", msg);
        msg.process(this);
    }

    /**
     * @returns {boolean} 
     */
    update() {
        _.assert.Edge(this);
        // TODO
        _.log(this, "update", data);
        return false;
    }

    /**
     * @returns {boolean} 
     */
    delete() {
        _.assert.Edge(this);
        _.log(this, "delete");
        let { from } = _private.get(this);
        _private.delete(this);
        _protected.delete(this);
        _protected.get(from).edges.delete(this);
        return true;
    }

    static [Symbol.hasInstance](instance) {
        return _private.has(instance);
    }

}

module.exports = Edge;