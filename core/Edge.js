/**
 * @module Edge 
 * @author Pfoerdie
 */

const
    _module = require("./index.js"),
    _ = _module.tools,
    _private = new WeakMap(),
    _package = _module.package;

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
        _package.set(this, {});
        _package.get(from).edges.add(this);
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
     * @returns {boolean} 
     */
    remove() {
        _.assert.Edge(this);
        let { from } = _private.get(this);
        _private.delete(this);
        _package.delete(this);
        _package.get(from).edges.delete(this);
        return true;
    }

    static [Symbol.hasInstance](instance) {
        return _private.has(instance);
    }

}

module.exports = Edge;