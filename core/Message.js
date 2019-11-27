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
        _private.set(this, { data, cache: new WeakMap() });
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

    process(edge) {
        _.assert.Message(this);
        _.assert.Edge(edge);
        _.log(this, "process", edge);
        edge.to.emit(this);
    }

    /**
     * @returns {boolean} 
     */
    update() {
        _.assert.Message(this);
        // TODO
        _.log(this, "update", data);
        return false;
    }

    /**
     * @returns {boolean} 
     */
    delete() {
        _.assert.Message(this);
        _.log(this, "delete");
        _private.delete(this);
        _protected.delete(this);
        return true;
    }

    /**
     * @returns {*} 
     */
    cache(...args) {
        _.assert.Message(this);
        // TODO
        _.log(this, "cache", ...args);
    }

    static [Symbol.hasInstance](instance) {
        return _private.has(instance);
    }

}

module.exports = Message;