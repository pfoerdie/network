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
     * @param {{uid: String, type: Array<String>}} [data={uid=UUID(),type=[]}]
     * @param {Array<[String|Entity, Object]>} [rels=[]]
     * @constructs Entity 
     * @extends Node
     */
    constructor(data = { uid: _.uuid(), type: [] }, rels = []) {
        _.assert.Object(data);
        _.assert.String(data.uid);
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

    /**
     * @param {object} data
     * @param {Array<[String|Entity, Object]>} [rels=[]]
     * @returns {boolean} 
     */
    update(data, rels = []) {
        _.assert.Entity(this);
        _.assert.Object(data);
        _.assert(data.uid === this.data.uid, "The uid does not match.");
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
        let uid = this.data.uid;
        let res = super.delete();
        if (res) _observer.emit("delete", uid);
        return res;
    }

}

class Relation extends _core.Edge {

}

module.exports = Entity;