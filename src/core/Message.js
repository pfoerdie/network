/**
 * @module Message 
 * @author Pfoerdie
 */

const
    _ = require("../tools"),
    _core = require("../core.js"),
    _private = new WeakMap(),
    _protected = _core.protected;

class Message {

    /**
     * @param {*} [data=null] 
     * @constructs Message 
     */
    constructor(data = null) {
        _private.set(this, { data, cache: new WeakMap(), delay: 1e3 });
        _protected.set(this, { target: new.target });
        _.log(this, "constructor", data);
    }

    /**
     * @type {object} 
     */
    get data() {
        _.assert.Message(this);
        return _private.get(this).data;
    }

    /**
     * @param {Node} node 
     * @param {...*} args
     * @returns {undefined}
     */
    process(node, ...args) {
        _.assert.Message(this);
        _.assert.Node(node);
        _.log(this, "process", node);
        node.emit(this, ...args);
    }

    /**
     * @param {Edge} edge 
     * @param {...*} args
     * @returns {undefined}
     */
    transfer(edge, ...args) {
        _.assert.Message(this);
        _.assert.Edge(edge);
        _.log(this, "transfer", edge);
        setTimeout(this.process.bind(this), _private.get(this).delay, edge.to, ...args);
    }

    /**
     * @returns {boolean} 
     */
    update() {
        _.assert.Message(this);
        _.log(this, "update", data);
        // TODO
        return false;
    }

    /**
     * @returns {boolean} 
     */
    remove() {
        _.assert.Message(this);
        _.log(this, "remove");
        _private.remove(this);
        _protected.remove(this);
        return true;
    }

    /**
     * @returns {*} 
     */
    cache(...args) {
        _.assert.Message(this);
        _.log(this, "cache", ...args);
        // TODO
    }

    static [Symbol.hasInstance](instance) {
        return _private.has(instance);
    }

}

module.exports = Message;