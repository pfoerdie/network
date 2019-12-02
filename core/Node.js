/**
 * @module Node 
 * @author Pfoerdie
 */

const
    _ = require("../tools"),
    _core = require("../core.js"),
    _private = new WeakMap(),
    _protected = _core.protected;

class Node {

    /**
     * @param {*} [data=null] 
     * @constructs Node 
     */
    constructor(data = null) {
        _private.set(this, { data });
        _protected.set(this, { target: new.target, edges: new Set() });
        _.log(this, "constructor", data);
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
        return _protected.get(this).edges.values();
    }

    get [Symbol.asyncIterator]() {
        _.assert.Node(this);
        return null;
    }

    /**
     * @param {Message} msg 
     * @param {...*} args
     * @returns {undefined}
     */
    emit(msg, ...args) {
        _.assert.Node(this);
        _.assert.Message(msg);
        _.log(this, "emit", msg);
        // _protected.get(this).edges.forEach(edge => setImmediate(edge.trigger.bind(edge), msg));
        _protected.get(this).edges.forEach(edge => edge.trigger(msg, ...args));
    }

    /**
     * @param {object} data
     * @returns {boolean} 
     */
    update(data) {
        _.assert.Node(this);
        _.log(this, "update", data);
        _private.get(this).data = data;
        return true;
    }

    /**
     * @returns {boolean} 
     */
    remove() {
        _.assert.Node(this);
        _.log(this, "remove");
        _private.remove(this);
        _protected.remove(this);
        return true;
    }

    static [Symbol.hasInstance](instance) {
        return _private.has(instance);
    }

}

module.exports = Node;