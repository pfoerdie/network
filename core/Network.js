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
            _.assert.String(node.data.id, val => !nodes.has(val));
        } else {
            _.assert.Object(node);
            _.assert.String(node.id, val => !nodes.has(val));
            node = _private.get(this).model.construct(node.type, node);
        }
        nodes.set(node.id, node);
        return node || null;
    }

    remove(node) {
        _.assert.Network(this);
        let { nodes } = _private.get(this);
        if (_.is.String(node)) node = nodes.get(node);
        _.assert.Node(node);
        let res = nodes.delete(node.id);
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
    remove() {
        _.assert.Network(this);
        _.log(this, "remove");
        _private.remove(this);
        _protected.remove(this);
        return true;
    }

    static [Symbol.hasInstance](instance) {
        return _private.has(instance);
    }

}

module.exports = Network;