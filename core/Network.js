/**
 * @module Network 
 * @author Pfoerdie
 */

const
    _ = require("../tools"),
    _core = require("../core.js"),
    _private = new WeakMap(),
    _protected = _core.protected;

class Network {

    /**
     * @constructs Network 
     */
    constructor() {
        _private.set(this, {});
        _protected.set(this, { target: new.target });
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
    update(...args) {
        _.assert.Network(this);
        // TODO
        _.log(this, "update", ...args);
        return false;
    }

    /**
     * @returns {boolean} 
     */
    delete() {
        _.assert.Network(this);
        _.log(this, "delete");
        _private.delete(this);
        _protected.delete(this);
        return true;
    }

    static [Symbol.hasInstance](instance) {
        return _private.has(instance);
    }

}

module.exports = Network;