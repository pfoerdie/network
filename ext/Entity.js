/**
 * @module Entity 
 * @author Pfoerdie
 */

const
    Observer = require("events"),
    _ = require("../tools"),
    _core = require("../core.js"),
    _private = new WeakMap(),
    _observer = new Observer();

class Entity extends _core.Node {

    /**
     * @param {{id: String, type: Array<String>}} [data={id=UUID(),type=[]}]
     * @param {Array<[String|Entity, Object]>} [rels=[]]
     * @constructs Entity 
     * @extends Node
     */
    constructor(data = { id: _.uuid(), type: [] }, rels = []) {
        _.assert.Object(data);
        _.assert.String(data.id);
        _.assert.array(data.type, _.is.String);
        _.assert.array(rels, ([target, data]) => _.is.String(target) || target instanceof Entity);
        super(data);
        rels.forEach(([target, data]) => {
            if (target instanceof Entity) {
                new Relation(this, target, data);
            }
        });
        _private.set(this, { rels });
        _observer.emit("create", this);
    }

    emit(...args) {
        _.assert.Entity(this);
        if (_.is.string(this.data.msg)) _.log(this.data.msg);
        super.emit(...args);
    }

    /**
     * @param {object} data
     * @param {Array<[String|Entity, Object]>} [rels=[]]
     * @returns {boolean} 
     */
    update(data, rels = []) {
        _.assert.Entity(this);
        _.assert.Object(data);
        _.assert(data.id === this.data.id, "The id does not match.");
        _.assert.array(data.type, _.is.String);
        // TODO merge rels
        let res = super.update(data);
        if (res) _observer.emit("update", this);
        return res;
    }

    /**
     * @returns {boolean} 
     */
    delete() {
        _.assert.Entity(this);
        let id = this.data.id;
        let res = super.delete();
        if (res) _observer.emit("delete", id);
        return res;
    }

}

class Relation extends _core.Edge {

}

module.exports = Entity;