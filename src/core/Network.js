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
        _.log(this, "constructor", model);
        _private.set(this, { model, nodes: new Map() });
        _protected.set(this, { target: new.target });
    }

    [Symbol.iterator]() {
        _.assert.Network(this);
        return _private.get(this).nodes.values();
    }

    createNode(data) {
        _.assert.Object(data);
        _.log(this, "createNode", data);
        let { nodes } = _private.get(this);
        _.assert.String(data.id, val => !nodes.has(val));
        let node = _private.get(this).model.construct(data);
        nodes.set(node.id, node);
        return node;
    }

    addNode(node) {
        _.assert.Network(this);
        _.assert.Node(node);
        _.assert.Object(node.data);
        _.log(this, "addNode", node);
        let { nodes, model } = _private.get(this);
        _.assert.String(node.data.id, val => !nodes.has(val));
        _.assert(model.supports(node), "That Node is not supported.");
        nodes.set(node.id, node);
        return node;
    }

    hasNode(id) {
        _.assert.Network(this);
        _.assert.String(id);
        return _private.get(this).nodes.has(id);
    }

    getNode(id) {
        _.assert.Network(this);
        _.assert.String(id);
        return _private.get(this).nodes.get(id) || null;
    }

    removeNode(node) {
        _.assert.Network(this);
        _.log(this, "removeNode", node);
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
        _.log(this, "update", ...args);
        // TODO
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