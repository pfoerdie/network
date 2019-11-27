const
    UUID = require("uuid/v4"),
    Colors = require("colors"),
    _package = require("./index.js");

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
    String(value) {
        return value && typeof value === 'string';
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
    number(value, checkFn) {
        assert(is.number(value), "Not a number.", TypeError);
        if (is.function(checkFn))
            assert(checkFn(value), "Invalid number.", TypeError);
    },
    string(value, checkFn) {
        assert(is.string(value), "Not a string.", TypeError);
        if (is.function(checkFn))
            assert(checkFn(value), "Invalid string.", TypeError);
    },
    String(value, checkFn) {
        assert(is.string(value), "Not a String.", TypeError);
        if (is.function(checkFn))
            assert(checkFn(value), "Invalid String.", TypeError);
    },
    // native
    function(value) {
        assert(is.function(value), "Not a function.", TypeError);
    },
    array(value, checkFn) {
        assert(is.array(value), "Not an array.", TypeError);
        if (is.function(checkFn))
            assert(value.every(checkFn), "Invalid entries in the array.", TypeError);
    },
    object(value) {
        assert(is.object(value), "Not an object.", TypeError);
    },
    Object(value, checkFn) {
        assert(is.Object(value), "Not an Object.", TypeError);
        if (is.function(checkFn))
            assert(Object.entries().every(checkFn), "Invalid entries in the Object.", TypeError);
    },
    // core
    Node(value) {
        assert(value instanceof _package.Node, "Not a Node.", TypeError);
    },
    Edge(value) {
        assert(value instanceof _package.Edge, "Not an Edge.", TypeError);
    },
    Message(value) {
        assert(value instanceof _package.Message, "Not a Message.", TypeError);
    },
    Model(value) {
        assert(value instanceof _package.Model, "Not a Model.", TypeError);
    },
    Network(value) {
        assert(value instanceof _package.Network, "Not a Network.", TypeError);
    },
    // ext
    Entity(value) {
        assert(value instanceof _package.Entity, "Not an Entity.", TypeError);
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

let logCount = 0;
exports.log = function log(scope, method, ...args) {
    let raw = "", color = "", { is } = exports, silent = false, colored = true;

    if (is.String(scope)) {
        raw = scope;
        color = Colors.yellow(scope);
    } else if (is.Object(scope) && is.String(method) && Reflect.has(scope, method)) {
        let scopeName = scope.__proto__.constructor.name, scopeData = is.String(scope.uid) ? scope.uid : is.String(scope.id) ? scope.id : JSON.stringify(scope.data) || "";
        let argPairs = args.map(arg => [arg === undefined ? "undefined" : arg === null ? "null" : arg.__proto__.constructor.name, !arg ? "" : is.String(arg.uid) ? arg.uid : is.String(arg.id) ? arg.id : JSON.stringify(arg.data) || ""]);

        raw = `${scopeName}<${scopeData}>.${method}(${argPairs.map(([argName, argData]) => `${argName}<${argData}>`).join(", ")})`;
        color = Colors.cyan(scopeName) + Colors.grey("<") + Colors.green(scopeData) + Colors.grey(">")
            + Colors.grey(".") + Colors.magenta(method) + Colors.grey("(")
            + argPairs.map(([argName, argData]) =>
                Colors.blue(argName) + (argData ? Colors.grey("<") + Colors.green(argData) + Colors.grey(">") : "")
            ).join(Colors.grey(", "))
            + Colors.grey(")");
    } else {
        return null;
    }

    raw = `log[${logCount}]: ` + raw;
    color = Colors.grey(`log[${logCount}]: `) + color;
    logCount++;

    if (!silent) console.log(colored ? color : raw);
    return raw;
};