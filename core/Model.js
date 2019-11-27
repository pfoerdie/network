/**
 * @module Model 
 * @author Pfoerdie
 */

const
    _ = require("../tools"),
    _core = require("../core.js"),
    _private = new WeakMap(),
    _protected = _core.protected;

class Model {

    /**
     * @constructs Model 
     */
    constructor() {
        _private.set(this, {});
        _protected.set(this, { target: new.target });
    }

    get [Symbol.iterator]() {
        _.assert.Model(this);
        return null;
    }

    get [Symbol.asyncIterator]() {
        _.assert.Model(this);
        return null;
    }

    static [Symbol.hasInstance](instance) {
        return _private.has(instance);
    }

}

module.exports = Model;