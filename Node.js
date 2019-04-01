/** @type {WeakMap<Node, {parents: Set<Node>, children: Set<Node>, events: Object.<(string|symbol), Map<Node, boolean>>}>} */
const _private = new WeakMap();

/**
 * This class is used to create networks of Nodes. Each Node is associated with some data
 * and can be connected with other Nodes. Events can be registered to a Node and might
 * be used to trigger a chain reaction within the network. This way implementations of
 * connected graphs, neural networks, process structures and finite automatons are made easy.
 * @class
 * @throws {TypeError} Every method will throw a TypeError, if arguments are not as specified.
 * @module  Node
 * @author Simon Petrac <pfoerdie@gmail.com>
 */
module.exports = class Node {

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
                get: () => data,
                set: (value) => data === null && typeof value === 'object'
                    ? data = value
                    : undefined
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
        if (!Node.isNode(this))
            throw new TypeError("Function call on an invalid Node.");
        if (this === node)
            throw new Error("You must not attach a Node to itself.");
        if (!Node.isNode(node))
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
        if (!Node.isNode(this))
            throw new TypeError("Function call on an invalid Node.");
        if (this === node)
            throw new Error("You must not attach a Node to itself.");
        if (!Node.isNode(node))
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
        if (!Node.isNode(this))
            throw new TypeError("Function call on an invalid Node.");
        if (!Node.isNode(node))
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
        if (!Node.isNode(this))
            throw new TypeError("Function call on an invalid Node.");
        if (!Node.isNode(node))
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
        if (!Node.isNode(this))
            throw new TypeError("Function call on an invalid Node.");
        if (!confirm)
            throw new Error("Deletion without confirmation will throw an error.");

        const { parents, children } = _private.get(this);
        parents.forEach(parent => _private.get(parent).children.delete(this));
        children.forEach(child => _private.get(child).parents.delete(this));
        _private.delete(this);
    } // Node#delete

    /**
     * Adds an event listener to the current Node.
     * @param {(string|symbol)} event The name of the event.
     * @param {function} callback The event callback.
     * @returns {Node} The current Node.
     */
    on(event, callback) {
        if (!Node.isNode(this))
            throw new TypeError("Function call on an invalid Node.");
        if (!event || (typeof event !== 'string' && typeof event !== 'symbol'))
            throw new TypeError("An event is identified by a string or a symbol.");
        if (typeof callback !== 'function')
            throw new TypeError("Adding an event listener requires a callback function.");

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
        if (!Node.isNode(this))
            throw new TypeError("Function call on an invalid Node.");
        if (!event || (typeof event !== 'string' && typeof event !== 'symbol'))
            throw new TypeError("An event is identified by a string or a symbol.");
        if (typeof callback !== 'function')
            throw new TypeError("Adding an event listener requires a callback function.");

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
        if (!Node.isNode(this))
            throw new TypeError("Function call on an invalid Node.");
        if (!event || (typeof event !== 'string' && typeof event !== 'symbol'))
            throw new TypeError("An event is identified by a string or a symbol.");
        if (typeof callback !== 'function')
            throw new TypeError("Removing an event listener requires the callback function to remove.");

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
        if (!Node.isNode(this))
            throw new TypeError("Function call on an invalid Node.");

        let { events } = _private.get(this);
        if (Reflect.has(events, event) && events[event].size > 0)
            events[event].forEach((once, callback, map) => {
                if (once) map.delete(callback);
                setImmediate(() => {
                    try {
                        // Prevents errors if a callback fails.
                        let tmp = callback.apply(this, args);
                        if (tmp instanceof Promise)
                            tmp.catch(err => console.error(err));
                    } catch (err) {
                        // The logging might be removed for productive use.
                        console.error(err);
                    }
                });
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
        if (!Node.isNode(this))
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
        if (!Node.isNode(this))
            throw new TypeError("Function call on an invalid Node.");

        let { parents } = _private.get(this);
        parents.forEach(parent => parent.trigger(event, ...args));

        return this;
    } // Node#emitBack

    /**
     * Indicates if an object is a valid Node.
     * @param {(Node|*)} node The object to test.
     * @returns {boolean} Indicator for the object.
     */
    static isNode(node) {
        return node instanceof Node && _private.has(node);
    } // Node.isNode

    /**
     * An alias for Node#constructor, but as function.
     * @param {object} [data=null] The data associated with the new Node.
     * @returns {Node} The newly created Node.
     */
    static createNode(data = null) {
        return new Node(data);
    } // Node.createNode

}; // Node