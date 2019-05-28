// IDEA class that uses Nodes and gives control over a whole network

const Node = require('./Node.js');

const _private = new WeakMap();

class Network extends Node {

    constructor(data) {
        super(data);

        Object.defineProperties(this, {

        });

        _private.set(this, {

        });
    } // Network#constructor

    static isNetwork(instance) {
        return instance instanceof Network
            && Node.isNode(instance);
    } // Network#isNetwork

} // Network

module.exports = Network;