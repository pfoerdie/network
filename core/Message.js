/**
 * @module Message 
 * @author Pfoerdie
 */

const
    _module = require("./index.js"),
    _ = _module.tools,
    _private = new WeakMap(),
    _package = _module.package;

class Message {

    /**
     * @param {object} [data=null] 
     * @constructs Message 
     */
    constructor(data = null) {
        _private.set(this, { data, cache: new WeakMap() });
        _package.set(this, {});
    }

    /**
     * @type {object} 
     */
    get data() {
        _.assert.Message(this);
        return _private.get(this).data;
    }

    /**
     * @returns {boolean} 
     */
    remove() {
        _.assert.Message(this);
        _private.delete(this);
        _package.delete(this);
        return true;
    }

    /**
     * @returns {*} 
     */
    cache() {
        _.assert.Message(this);
        // TODO
    }

    static [Symbol.hasInstance](instance) {
        return _private.has(instance);
    }

}

module.exports = Message;