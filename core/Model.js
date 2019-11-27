/**
 * @module Model 
 * @author Pfoerdie
 */

const
    _module = require("./index.js"),
    _ = _module.tools,
    _private = new WeakMap(),
    _package = _module.package;

class Model {

    /**
     * @constructs Model 
     */
    constructor() {
        _private.set(this, {});
        _package.set(this, {});
    }

    get [Symbol.iterator]() {
        _.assert.Model(this);
        return null;
    }

    get [Symbol.asyncIterator]() {
        _.assert.Model(this);
        return null;
    }

    /**
     * @returns {boolean} 
     */
    remove() {
        _.assert.Model(this);
        _private.delete(this);
        _package.delete(this);
        return true;
    }

    /**
     * @returns {boolean} 
     */
    refresh() {
        _.assert.Model(this);
        // TODO
        return false;
    }

    static [Symbol.hasInstance](instance) {
        return _private.has(instance);
    }

}

module.exports = Model;