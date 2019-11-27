/**
 * @module Network 
 * @author Pfoerdie
 */

const
    _module = require("./index.js"),
    _ = _module.tools,
    _private = new WeakMap(),
    _package = _module.package;

class Network {

    /**
     * @constructs Network 
     */
    constructor() {
        _private.set(this, {});
        _package.set(this, {});
    }

    get [Symbol.iterator]() {
        _.assert.Network(this);
        return null;
    }

    get [Symbol.asyncIterator]() {
        _.assert.Network(this);
        return null;
    }

    /**
     * @returns {boolean} 
     */
    remove() {
        _.assert.Network(this);
        _private.delete(this);
        _package.delete(this);
        return true;
    }

    /**
     * @returns {boolean} 
     */
    refresh() {
        _.assert.Network(this);
        // TODO
        return false;
    }

    static [Symbol.hasInstance](instance) {
        return _private.has(instance);
    }

}

module.exports = Network;