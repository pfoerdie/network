const
    _ = require("./tools.js"),
    _module = require("./module.js"),
    _private = new WeakMap();

class Node {

    constructor(data = null) {
        _.assert(typeof data === "object", "The data of a Node has to be an object.");
        _private.set(this, { data, target: new.target, edges: new Set() });
    }

    get data() {
        _.assert(this instanceof Node, "This is not an instance of a Node.");
        return _private.get(this).data;
    }

    delete() {
        _.assert(this instanceof Node, "This is not an instance of a Node.");
        return _private.delete(this);
    }

    emit(msg) {
        _.assert(this instanceof Node, "This is not an instance of a Node.");
        _.assert(this instanceof _module.Message, "Only a Message can be emitted.");
        let { edges } = _private.get(this);
        // TODO
    }

    [Symbol.iterator]() {
        _.assert(this instanceof Node, "This is not an instance of a Node.");
        return _private.get(this).edges.values();
    }

    [Symbol.hasInstance](node) {
        return _private.has(node);
    }

}

module.exports = Node;