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
     * @param {String} name 
     * @constructs Model 
     */
    constructor(name) {
        _.assert.String(name);
        _private.set(this, { name, classes: new Set(), locked: false });
        _protected.set(this, {});
        _.log(this, "constructor", name);
    }

    get id() {
        _.assert.Model(this);
        return _private.get(this).name;
    }

    [Symbol.iterator]() {
        _.assert.Model(this);
        return _private.get(this).classes.keys();
    }

    lock() {
        _.assert.Model(this);
        _private.get(this).locked = true;
        return this;
    }

    define(Class) {
        _.assert.Model(this);
        _.assert(!_private.get(this).locked, "This Model is locked.");
        _.assert.function(Class);
        _.assert(Class === _core.Node || _core.Node.isPrototypeOf(Class), "Class has to inherit from Node.");
        _.assert(!_private.get(this).classes.has(Class), "Class is already defined.");
        _private.get(this).classes.add(Class);
        return this;
    }

    construct(data) {
        _.assert.Model(this);
        _.assert.Object(data);
        _.log(this, "construct", data);
        let types = _.is.array(data.type) ? data.type : [data.type];
        _.assert.array(types, _.is.String);
        let [Class, ...tmp] = Array.from(_private.get(this).classes.values())
            .filter(tmpClass => types.some(type => type === tmpClass.name));
        _.assert(Class, "No constructor has been found.");
        _.assert(tmp.length === 0, "No unique constructor has been found.");
        let res = new Class(data);
        return res;
    }

    supports(node) {
        _.assert.Model(this);
        _.assert.Node(node);
        let { target } = _protected.get(node);
        return Array.from(_private.get(this).classes.values()).some(Class => target === Class);
    }

    static [Symbol.hasInstance](instance) {
        return _private.has(instance);
    }

}

module.exports = Model;