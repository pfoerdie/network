/**
 * @module Node 
 * @author Pfoerdie
 */

const
    _module = require("./index.js"),
    _ = _module.tools,
    _private = new WeakMap(),
    _package = _module.package;

class Node {

    /**
     * @param {object} [data=null] 
     * @constructs Node 
     */
    constructor(data = null) {
        _private.set(this, { data });
        _package.set(this, { edges: new Set() });
    }

    /**
     * @type {object} 
     */
    get data() {
        _.assert.Node(this);
        return _private.get(this).data;
    }

    get [Symbol.iterator]() {
        _.assert.Node(this);
        return null;
    }

    get [Symbol.asyncIterator]() {
        _.assert.Node(this);
        return null;
    }

    /**
     * @returns {boolean} 
     */
    remove() {
        _.assert.Node(this);
        _private.delete(this);
        _package.delete(this);
        return true;
    }

    /**
     * @returns {boolean} 
     */
    refresh() {
        _.assert.Node(this);
        // TODO
        return false;
    }

    static [Symbol.hasInstance](instance) {
        return _private.has(instance);
    }

}

module.exports = Node;