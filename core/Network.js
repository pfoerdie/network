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
    constructor(model) {
        _.assert.Model(model);
        _private.set(this, { model, nodes: new Map() });
        _protected.set(this, { target: new.target });
        _.log(this, "constructor", model);
    }

    get [Symbol.iterator]() {
        _.assert.Network(this);
        return _private.get(this).nodes.values();
    }

    add(node) {
        _.assert.Network(this);
        let { nodes } = _private.get(this);
        if (node instanceof _core.Node) {
            _.assert.Object(node.data);
            _.assert.String(node.data.uid, val => !nodes.has(val));
        } else {
            _.assert.Object(node);
            _.assert.String(node.uid, val => !nodes.has(val));
            node = _private.get(this).model.construct(node);
        }
        nodes.set(node.uid, node);
        return node || null;
    }

    remove(node) {
        _.assert.Network(this);
        let { nodes } = _private.get(this);
        if (_.is.String(node)) node = nodes.get(node);
        _.assert.Node(node);
        let res = nodes.delete(node.uid);
        return res ? node : null;
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