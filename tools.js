const
    UUID = require("uuid/v4"),
    _module = require("./index.js");

exports.uuid = UUID;

exports.define = function define(obj, key, value, get, set) {
    Object.defineProperty(obj, key, (get || set) ? { get, set } : { value });
};

exports.enumerate = function enumerate(obj, key, value, get, set) {
    let enumerable = true;
    Object.defineProperty(obj, key, (get || set) ? { get, set, enumerable } : { value, enumerable });
};

exports.is = {
    number(value) {
        return typeof value === 'number' && !isNaN(value);
    },
    string(value) {
        return typeof value === 'string';
    },
    function(value) {
        return typeof value === 'function';
    },
    array(value) {
        return Array.isArray(value);
    },
    object(value) {
        return typeof value == 'object';
    },
    Object(value) {
        return value && typeof value == 'object';
    }
};

exports.assert = ((assert, is) => Object.assign(assert, {
    // primitive
    number(value, errMsg) {
        assert(is.number(value), errMsg || "Not a number.", TypeError);
    },
    string(value, errMsg) {
        assert(is.string(value), errMsg || "Not a string.", TypeError);
    },
    // native
    function(value, errMsg) {
        assert(is.function(value), errMsg || "Not a function.", TypeError);
    },
    array(value, errMsg) {
        assert(is.array(value), errMsg || "Not an array.", TypeError);
    },
    object(value, errMsg) {
        assert(is.object(value), errMsg || "Not an object.", TypeError);
    },
    Object(value, errMsg) {
        assert(is.Object(value), errMsg || "Not an Object.", TypeError);
    },
    // core
    Node(value, errMsg) {
        assert(value instanceof _module.Node, errMsg || "Not a Node.", TypeError);
    },
    Edge(value, errMsg) {
        assert(value instanceof _module.Edge, errMsg || "Not an Edge.", TypeError);
    },
    Message(value, errMsg) {
        assert(value instanceof _module.Message, errMsg || "Not a Message.", TypeError);
    },
    Model(value, errMsg) {
        assert(value instanceof _module.Model, errMsg || "Not a Model.", TypeError);
    },
    Network(value, errMsg) {
        assert(value instanceof _module.Network, errMsg || "Not a Network.", TypeError);
    }
}))(function assert(value, errMsg, errType = Error) {
    if (!value) {
        let err = (errMsg instanceof Error) ? errMsg : null;
        if (!err) {
            err = new errType(errMsg);
            Error.captureStackTrace(err, assert);
        }
        throw err;
    }
}, exports.is);

exports.promify = function promify(fn, ...args) {
    return new Promise((resolve, reject) => fn(...args, (err, result) => err ? reject(err) : resolve(result)));
};