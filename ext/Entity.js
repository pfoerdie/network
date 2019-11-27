/**
 * @module Entity 
 * @author Pfoerdie
 */

const
    _module = require("./index.js"),
    _ = _module.tools;

class Entity extends _module.Node {

    /**
     * @param {Object} data
     * @constructs Entity 
     * @extends Node
     */
    constructor(data) {
        _.assert.Object(data);
        super(data);
    }

    /**
     * @returns {boolean} 
     */
    remove() {
        _.assert.Entity(this);
        // TODO
        return false;
    }

    /**
     * @returns {boolean} 
     */
    refresh() {
        _.assert.Entity(this);
        // TODO
        return false;
    }

}

module.exports = Entity;