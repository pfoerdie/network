const
    _ = require("./tools"),
    _module = require("./module.js");

class Param {

    constructor(param) {
        _.assert(_.is.object(param), "param is not an object");
        Object.assign(this, param);
        _.assert(_.is.string(this.uid), "uid is not a string");
        _.assert(_.is.string(this.type) || (_.is.array(this.type) && this.type.every(_.is.string)), "type is not a string or array of strings");
    }

}

class Relation extends _module.Edge {

    // constructor(from, to, param = null) {
    //     _.assert(typeof param === "object", "data is not an object");
    //     _.assert(to instanceof _module.Node, "to is not a node");
    //     _.assert(from instanceof _module.Node, "from is not a node");
    //     _private.set(this, { data, from, to });
    //     _module.package.set(this, { target: new.target });
    //     _module.package.get(from).edges.add(this);
    // }

}

class Entity extends _module.Node {

    constructor(param, rels = []) {
        // TODO convert rels to an object consisting of uids as keys
        // and value ether an entity or null for an unknown relation
        // * OR * relation type as keys and arrays with uid strings or entites as value
        _.assert(_.is.array(rels) && rels.every(rel => _.is.string(rel) || rel instanceof Entity), "rels is not an array of entities");
        super(new Param(param));
        rels = rels.map(rel => _.is.string(rel) ? rel : new Relation(this, rel, null));
    }

}

module.exports = Entity;