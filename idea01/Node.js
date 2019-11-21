const
    _ = require("./tools"),
    _module = require("./module.js");

class Node {

    /**
     * Constructs a node.
     * @param {*} data 
     * @param {Symbol} [secret]
     * @param {string} [uid]
     * @constructs Node
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
        _module.private.set(this, { target: new.target, data, edges: new Set() });
        _module.instances.set(this.uid, this);
    }

    /**
     * Data of the node.
     * @type {*}
     */
    get data() {
        _.assert(Node.isNode(this), "this is not a node");
        return _module.private.get(this).data;
    }

    /**
     * Queues a message to process for all edges.
     * @param {Message|UUID} msg 
     * @returns {undefined}
     */
    queue(msg) {
        _.assert(Node.isNode(this), "this is not a node");
        if (_.is.string(msg)) {
            _.assert(_module.instances.has(msg));
            msg = _module.instances.get(msg);
        }
        _.assert(Message.isMessage(msg), "that is not a message");
        let { edges } = _module.private.get(this);
        edges.forEach(edge => setImmediate(edge.transfer.bind(edge), msg));
    }

    /**
     * Removes a node so it might get deleted.
     * @returns {boolean|null}
     */
    remove() {
        _.assert(Node.isNode(this), "this is not a node");
        if (_module.instances.has(this.uid)) {
            _.assert(_module.instances.get(this.uid) === this, `this.uid = ${this.uid} is occupied`);
            return _module.instances.delete(this.uid);
        } else {
            return null;
        }
    }

    /**
     * Returns a node that previously got removed.
     * @returns {boolean|null}
     */
    refresh() {
        _.assert(Node.isNode(this), "this is not a node");
        if (_module.instances.has(this.uid)) {
            _.assert(_module.instances.get(this.uid) === this, `this.uid = ${this.uid} is occupied`);
            return null;
        } else {
            _module.instances.set(this.uid, this);
            return true;
        }
    }

    /**
     * Deletes a node completely.
     * @returns {boolean|null}
     */
    delete() {
        _.assert(Node.isNode(this), "this is not a node");
        if (_module.instances.has(this.uid) && _module.instances.get(this.uid) === this) {
            _module.instances.delete(this.uid);
        }
        let { edges } = _module.private.get(this);
        edges.clear();
        return _module.private.delete(this);
    }

    /**
     * Tells if an object is a node.
     * @param {*} node 
     * @returns {boolean}
     */
    static isNode(node) {
        return node instanceof Node && _module.private.has(node);
    }

    /**
     * To string method.
     * @returns {string}
     */
    toString() {
        _.assert(Node.isNode(this), "this is not a node");
        let { target } = _module.private.get(this);
        return `${target.name}<${this.uid}>`;
    }

    /**
     * To json method.
     * @returns {JSON}
     */
    toJSON() {
        _.assert(Node.isNode(this), "this is not a node");
        let { target, data, edges } = _module.private.get(this);
        return {
            type: target.name,
            uid: this.uid,
            data,
            edges: Array.from(edges.values()).map(edge => edge.uid)
        };
    }

}

module.exports = Node;