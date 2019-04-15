/** 
 * The private properties of a Node instance.
 * @type {WeakMap<Node, {parents: Set<Node>, children: Set<Node>, events: Object.<(string|symbol), Map<Node, boolean>>}>} 
 * @private
 */
const _private = new WeakMap();

/**
 * Indicates the deleted Nodes.
 * @type {WeakSet<Node>}
 * @private
 */
const _deleted = new WeakSet();

/**
 * This class is used to create networks of Nodes. Each Node is associated with some data
 * and can be connected with other Nodes. Events can be registered to a Node and might
 * be used to trigger a chain reaction within the network. This way implementations of
 * connected graphs, neural networks, process structures and finite automatons are made easy.
 * @class
 * @throws {TypeError} Every method will throw a TypeError, if arguments are not as specified.
 */
class Node {

    /**
     * Constructs a new Node to use with other Nodes.
     * @param {object} [data=null] The data associated with the new Node. Can be set later if not defined.
     * @constructs Node
     */
    constructor(data = null) {
        if (typeof data !== 'object')
            throw new TypeError("The data for a Node can only be an object.");

        Object.defineProperties(this, {
            data: {
                value: data,
                // get: () => data,
                // set: (value) => data === null && typeof value === 'object'
                //     ? data = value
                //     : undefined
            }
        });

        _private.set(this, {
            parents: new Set(),
            children: new Set(),
            events: {}
        });
    } // Node#constructor

    /**
     * Creates an outgoing connection from the current to another Node.
     * @param {Node} node The Node to attach as child.
     * @throws {Error} Throws an error, if you attach a Node to itself.
     * @returns {Node} The current Node.
     */
    attach(node) {
        if (!(_isNode(this)))
            throw new TypeError("Function call on an invalid Node.");
        if (this === node)
            throw new Error("You must not attach a Node to itself.");
        if (!(_isNode(node)))
            throw new TypeError("You can only attach valid Nodes.");

        _private.get(this).children.add(node);
        _private.get(node).parents.add(this);

        return this;
    } // Node#attach

    /**
     * An alias for Node#attach, reversing current Node and argument.
     * @param {Node} node The Node to attach to as child.
     * @throws {Error} Throws an error, if you attach a Node to itself.
     * @returns {Node} The current Node.
     */
    attachTo(node) {
        if (!(_isNode(this)))
            throw new TypeError("Function call on an invalid Node.");
        if (this === node)
            throw new Error("You must not attach a Node to itself.");
        if (!(_isNode(node)))
            throw new TypeError("You can only attach to valid Nodes.");

        node.attach(this);

        return this;
    } // Node#attachTo

    /**
     * Removes an outgoing connection from the current Node.
     * @param {Node} node The Node to detach from children.
     * @returns {Node} The current Node.
     */
    detach(node) {
        if (!(_isNode(this)))
            throw new TypeError("Function call on an invalid Node.");
        if (!(_isNode(node)))
            throw new TypeError("Detaching requires a valid Node.");

        if (_private.get(this).children.delete(node))
            _private.get(node).parents.delete(this);

        return this;
    } // Node#detach

    /**
     * An alias for Node#detach, reversing current Node and argument.
     * @param {Node} node The Node to detach from as child.
     * @returns {Node} The current Node.
     */
    detachFrom(node) {
        if (!(_isNode(this)))
            throw new TypeError("Function call on an invalid Node.");
        if (!(_isNode(node)))
            throw new TypeError("You can only detach from valid Nodes.");

        node.detach(this);

        return this;
    } // Node#detachFrom

    /**
     * Removes all ingoing and outgoing connections of the current Node and deletes it permanently.
     * @param {boolean} [confirm=false] You must confirm deletion.
     * @throws {Error} Throws an error, if you do not confirm the deletion.
     * @returns {undefined} Nothing to return any more.
     */
    delete(confirm = false) {
        if (!(_isNode(this)))
            throw new TypeError("Function call on an invalid Node.");
        if (!confirm)
            throw new Error("Deletion without confirmation will throw an error.");

        const { parents, children } = _private.get(this);
        parents.forEach(parent => _private.get(parent).children.delete(this));
        children.forEach(child => _private.get(child).parents.delete(this));

        _deleted.add(this);
        _private.delete(this);
    } // Node#delete

    /**
     * Indicates if a Node has been deleted.
     * @type {boolean}
     */
    get deleted() {
        return _deleted.has(this);
    } // Node#deleted

    /**
     * Adds an event listener to the current Node.
     * @param {(string|symbol)} event The name of the event.
     * @param {function} callback The event callback.
     * @returns {Node} The current Node.
     */
    on(event, callback) {
        if (!(_isNode(this)))
            throw new TypeError("Function call on an invalid Node.");
        if (!(_isEvent(event, callback)))
            throw new TypeError("An event is identified by a string or a symbol and a callback function.");

        let { events } = _private.get(this);
        if (!Reflect.has(events, event))
            events[event] = new Map();
        events[event].set(callback, false);

        return this;
    } // Node#on

    /**
     * Adds an event listener to the current Node for a single call.
     * @param {(string|symbol)} event The name of the event.
     * @param {function} callback The event callback.
     * @returns {Node} The current Node.
     */
    once(event, callback) {
        if (!(_isNode(this)))
            throw new TypeError("Function call on an invalid Node.");
        if (!(_isEvent(event, callback)))
            throw new TypeError("An event is identified by a string or a symbol and a callback function.");

        let { events } = _private.get(this);
        if (!Reflect.has(events, event))
            events[event] = new Map();
        events[event].set(callback, true);

        return this;
    } // Node#once

    /**
     * Removes an event listener from the current Node.
     * @param {(string|symbol)} event The name of the event.
     * @param {function} callback The event callback.
     * @returns {Node} The current Node.
     */
    off(event, callback) {
        if (!(_isNode(this)))
            throw new TypeError("Function call on an invalid Node.");
        if (!(_isEvent(event, callback)))
            throw new TypeError("An event is identified by a string or a symbol and a callback function.");

        let { events } = _private.get(this);
        if (Reflect.has(events, event))
            events[event].delete(callback);

        return this;
    } // Node#off

    /**
     * Triggers an event on the current Node with assigned arguments on the next event loop.
     * @param {(string|symbol)} event The name of the event.
     * @param {...any} args The arguments for the event callbacks.
     * @returns {Node} The current Node.
     */
    trigger(event, ...args) {
        if (!(_isNode(this)))
            throw new TypeError("Function call on an invalid Node.");

        let { events } = _private.get(this);
        if (Reflect.has(events, event) && events[event].size > 0)
            events[event].forEach((once, callback, map) => {
                if (once) map.delete(callback);
                _makeEventCall(this, callback, args)
            });

        return this;
    } // Node#trigger

    /**
     * Emits an event to all children of the current Node with assigned arguments.
     * @param {(string|symbol)} event The name of the event.
     * @param {...any} args The arguments for the event callbacks.
     * @returns {Node} The current Node.
     */
    emit(event, ...args) {
        if (!(_isNode(this)))
            throw new TypeError("Function call on an invalid Node.");

        let { children } = _private.get(this);
        children.forEach(child => child.trigger(event, ...args));

        return this;
    } // Node#emit

    /**
     * Emits an event to all parents of the current Node with assigned arguments.
     * @param {(string|symbol)} event The name of the event.
     * @param {...any} args The arguments for the event callbacks.
     * @returns {Node} The current Node.
     */
    emitBack(event, ...args) {
        if (!(_isNode(this)))
            throw new TypeError("Function call on an invalid Node.");

        let { parents } = _private.get(this);
        parents.forEach(parent => parent.trigger(event, ...args));

        return this;
    } // Node#emitBack

    /**
     * Indicates if an object is a valid Node.
     * @param {(Node|*)} instance The instance to be tested.
     * @returns {boolean} Indicator for been a Node.
     */
    static get isNode() {
        return _isNode;
    } // _isNode

} // Node

/**
 * Indicates if an object is a valid Node.
 * @param {(Node|*)} instance The instance to be tested.
 * @returns {boolean} Indicator for been a Node.
 */
function _isNode(instance) {
    return (instance instanceof Node) && !_deleted.has(this);
} // _isNode

/**
 * Indicates if event name and callback for an event have valid types.
 * @param {(string|*)} event The event name to be tested.
 * @param {(function|*)} callback The callback to be tested.
 * @returns {boolean} Indicator for been a valid event.
 */
function _isEvent(event, callback) {
    return event && (typeof event === 'string' || typeof event === 'symbol') && typeof callback === 'function';
} // _isEvent

/**
 * Makes the actual call to an event callback, ignoring all errors.
 * @param {Node} scope The current Node for this call.
 * @param {function} callback The callback of an event.
 * @param {Array} args The arguments passed to the trigger function.
 * @returns immediateID
 * @private
 */
function _makeEventCall(scope, callback, args) {
    return setImmediate(() => {
        // Prevents errors if a callback fails.
        try {
            let result = callback.call(scope, ...args);
            if (result instanceof Promise)
                result.catch(err => console.error(err));
        } catch (err) {
            // The logging might be removed for productive use.
            console.error(err);
        }
    });
} // _makeEventCall

/**
 * @module  Node
 * @author Simon Petrac <pfoerdie@gmail.com>
 */
module.exports = Node;