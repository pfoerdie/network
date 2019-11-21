const
    _ = require("./tools"),
    _module = require("./module.js");

class Edge {

    /**
     * Constructs an edge.
     * @param {Node} from 
     * @param {Node} to 
     * @param {*} data 
     * @param {Symbol} [secret]
     * @param {string} [uid]
     * @constructs Edge
     * @property {UUID} uid
     */
    constructor(from, to, data = null, secret, uid) {
        if (secret) {
            _.assert(secret === _module.secret, "secret is invalid");
            _.assert(_.is.string(uid), "uid is no string");
            _.enumerate(this, "uid", uid);
            if (_.is.string(from)) from = _module.instances.get(from);
            if (_.is.string(to)) to = _module.instances.get(to);
        } else {
            _.enumerate(this, "uid", _.uuid());
        }
        _.assert(typeof data === "object", "data is not an object");
        _.assert(_module.Node.isNode(to), "to is not a node");
        _.assert(_module.Node.isNode(from), "from is not a node");
        _.assert(!_module.instances.has(this.uid), `uuid conflict for new.uid = ${this.uid}`);
        _module.private.get(from).edges.add(this);
        _module.private.set(this, { target: new.target, from, to, data });
        _module.instances.set(this.uid, this);
    }

    /**
     * Source of the edge.
     * @type {Node}
     */
    get from() {
        _.assert(Edge.isEdge(this), "this is not an edge");
        return _module.private.get(this).from;
    }

    /**
     * Target of the edge.
     * @type {Node}
     */
    get to() {
        _.assert(Edge.isEdge(this), "this is not an edge");
        return _module.private.get(this).to;
    }

    /**
     * Data of the edge.
     * @type {*}
     */
    get data() {
        _.assert(Edge.isEdge(this), "this is not an edge");
        return _module.private.get(this).data;
    }

    /**
     * Transfers a message, triggering processing of this edge. Eventually gets called after a node queued that message.
     * @param {Message|UUID} msg 
     * @interface
     */
    transfer(msg) {
        _.assert(Edge.isEdge(this), "this is not an edge");
        if (_.is.string(msg)) {
            _.assert(_module.instances.has(msg));
            msg = _module.instances.get(msg);
        }
        _.assert(_module.Message.isMessage(msg), "that is not a message");
        msg.process(this);
    }

    /**
     * Removes an edge so it might get deleted.
     * @returns {boolean|null}
     */
    remove() {
        _.assert(Edge.isEdge(this), "this is not an edge");
        if (_module.instances.has(this.uid)) {
            _.assert(_module.instances.get(this.uid) === this, `this.uid = ${this.uid} is occupied`);
            return _module.instances.delete(this.uid);
        } else {
            return null;
        }
    }

    /**
     * Returns an edge that previously got removed.
     * @returns {boolean|null}
     */
    refresh() {
        _.assert(Edge.isEdge(this), "this is not an edge");
        if (_module.instances.has(this.uid)) {
            _.assert(_module.instances.get(this.uid) === this, `this.uid = ${this.uid} is occupied`);
            return null;
        } else {
            _module.instances.set(this.uid, this);
            return true;
        }
    }

    /**
     * Deletes an edge completely.
     * @returns {boolean|null}
     */
    delete() {
        _.assert(Edge.isEdge(this), "this is not an edge");
        if (_module.instances.has(this.uid) && _module.instances.get(this.uid) === this) {
            _module.instances.delete(this.uid);
        }
        let { from, to } = _module.private.get(this);
        _module.private.get(from).edges.delete(this);
        return _module.private.delete(this);
    }

    /**
     * Tells if an object is an edge.
     * @param {*} edge 
     * @returns {boolean}
     */
    static isEdge(edge) {
        return edge instanceof Edge && _module.private.has(edge);
    }

    /**
     * To string method.
     * @returns {string}
     */
    toString() {
        _.assert(Edge.isEdge(this), "this is not an edge");
        let { target } = _module.private.get(this);
        return `${target.name}<${this.uid}>`;
    }

    /**
     * To json method.
     * @returns {JSON}
     */
    toJSON() {
        _.assert(Edge.isEdge(this), "this is not an edge");
        let { target, from, to, data } = _module.private.get(this);
        return {
            type: target.name,
            uid: this.uid,
            data,
            from: from.uid,
            to: to.uid
        };
    }

}

module.exports = Edge;