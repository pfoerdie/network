const
    _ = require("./tools"),
    _module = require("./module.js");

class Message {

    /**
     * Constructs a message.
     * @param {*} data 
     * @param {Symbol} [secret]
     * @param {string} [uid]
     * @constructs Message
     * @property {UUID} uid
     */
    constructor(data = null, secret, uid) {
        if (secret) {
            _.assert(secret === _module.secret, "secret is invalid");
            _.assert(_.is.string(uid), "uid is no string");
            _.enumerate(this, "uid", uid);
        } else {
            _.enumerate(this, "uid", _.uuid());
        }
        _.assert(typeof data === "object", "data is not an object");
        _.assert(!_module.instances.has(this.uid), `uuid conflict for new.uid = ${this.uid}`);
        _module.private.set(this, { target: new.target, data, cache: new WeakMap() });
        _module.instances.set(this.uid, this);
    }

    /**
     * Data of the message.
     * @type {*}
     */
    get data() {
        _.assert(Message.isMessage(this), "this is not a message");
        return _module.private.get(this).data;
    }

    /**
     * Processes an edge. Eventually gets called after an edge transfers this message.
     * @param {Edge|UUID} edge 
     * @interface
     */
    process(edge) {
        _.assert(Message.isMessage(this), "this is not a message");
        if (_.is.string(edge)) {
            _.assert(_module.instances.has(edge));
            edge = _module.instances.get(edge);
        }
        _.assert(_module.Edge.isEdge(edge), "that is not an edge");
    }

    /**
     * Returns a cache object for any particular node.
     * @param {Node} node 
     * @returns {Object}
     */
    cache(node) {
        _.assert(Message.isMessage(this), "this is not a message");
        _.assert(_module.Node.isNode(node), "that is not a node");
        let { cache } = _module.private.get(this);
        if (!cache.has(node)) cache.set(node, {});
        return cache.get(node);
        // TODO is this really useful?
    }

    /**
     * Removes a message so it might get deleted.
     * @returns {boolean|null}
     */
    remove() {
        _.assert(Message.isMessage(this), "this is not a message");
        if (_module.instances.has(this.uid)) {
            _.assert(_module.instances.get(this.uid) === this, `this.uid = ${this.uid} is occupied`);
            return _module.instances.delete(this.uid);
        } else {
            return null;
        }
    }

    /**
     * Deletes a message completely.
     * @returns {boolean|null}
     */
    delete() {
        _.assert(Message.isMessage(this), "this is not a message");
        if (_module.instances.has(this.uid) && _module.instances.get(this.uid) === this) {
            _module.instances.delete(this.uid);
        }
        return _module.private.delete(this);
    }

    /**
     * Tells if an object is a message.
     * @param {*} msg 
     * @returns {boolean}
     */
    static isMessage(msg) {
        return msg instanceof Message && _module.private.has(msg);
    }

    /**
     * To string method.
     * @returns {string}
     */
    toString() {
        _.assert(Message.isMessage(this), "this is not a message");
        let { target } = _module.private.get(this);
        return `${target.name}<${this.uid}>`;
    }

    /**
     * To json method.
     * @returns {JSON}
     */
    toJSON() {
        _.assert(Message.isMessage(this), "this is not a message");
        let { target, data } = _module.private.get(this);
        return {
            type: target.name,
            uid: this.uid,
            data
        };
    }

}

module.exports = Message;