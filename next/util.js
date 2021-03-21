const
    _ = exports,
    uuid = require('uuid').v4,
    colors = require('colors'),
    net = require('.');

_.randomID = function randomID() {
    return uuid.v4();
};

_.hideProp = function hideProp(obj, ...keys) {
    const hide = { enumerable: false };
    keys.filter(key => obj.hasOwnProperty(key) && Reflect.getOwnPropertyDescriptor(obj, key).configurable)
        .forEach(key => Object.defineProperty(obj, key, hide));
    return _;
};

_.hideProp.andLock = function hideAndLockProp(obj, ...keys) {
    const hideLock = { enumerable: false, writable: false, configurable: false };
    keys.filter(key => obj.hasOwnProperty(key) && Reflect.getOwnPropertyDescriptor(obj, key).configurable)
        .forEach(key => Object.defineProperty(obj, key, hideLock));
    return _;
};

_.lockProp = function lockProp(obj, ...keys) {
    const lock = { writable: false, configurable: false };
    keys.filter(key => obj.hasOwnProperty(key) && Reflect.getOwnPropertyDescriptor(obj, key).configurable)
        .forEach(key => Object.defineProperty(obj, key, lock));
    return _;
};

_.lockProp.andHide = _.hideProp.andLock;

_.lockProp.allEntries = function lockAllProp(obj) {
    _.lockProp(obj, ...Object.keys(obj));
    return _;
};

_.is = function isValue(value) {
    return (value ?? null) !== null;
};

_.is.number = function isNumber(value) {
    return typeof value === 'number' && !isNaN(value);
};

_.is.string = function isString(value) {
    return typeof value === 'string';
};

_.is.string.nonempty = function isNonemptyString(value) {
    return _.is.string(value) && value.length > 0;
};

_.is.symbol = function isSymbol(value) {
    return typeof value === 'symbol';
};

_.is.function = function isFunction(value) {
    return typeof value === 'function';
};

_.is.array = function isArray(value) {
    return Array.isArray(value) || ArrayBuffer.isView(value);
};

_.is.array.nonempty = function isNonemptyArray(value) {
    return _.is.array(value) && value.length > 0;
};

_.is.object = function isObject(value) {
    return value && typeof value === 'object';
};

_.assert = function assert(value, errMsg = 'undefined', errType = Error) {
    if (!value) {
        const err = new errType(errMsg);
        Error.captureStackTrace(err, _.assert);
        throw err;
    };
};

_.assert.number = function assertNumber(value, checkFn) {
    _.assert(_.is.number(value), 'Not a number.', TypeError);
    if (_.is.function(checkFn))
        _.assert(checkFn(value), 'Invalid number.', TypeError);
};

_.assert.string = function assertString(value, checkFn) {
    _.assert(_.is.string(value), 'Not a string.', TypeError);
    if (_.is.function(checkFn))
        _.assert(checkFn(value), 'Invalid string.', TypeError);
};

_.assert.function = function assertFunction(value) {
    _.assert(_.is.function(value), 'Not a function.', TypeError);
};

_.assert.array = function assertArray(value, checkFn) {
    _.assert(_.is.array(value), 'Not an array.', TypeError);
    if (_.is.function(checkFn))
        _.assert(value.every(checkFn), 'Invalid entries in the array.', TypeError);
};

_.assert.object = function assertObject(value, checkFn) {
    _.assert(_.is.object(value), 'Not an object.', TypeError);
    if (_.is.function(checkFn))
        _.assert(Object.entries().every(checkFn), 'Invalid entries in the object.', TypeError);
};

_.assert.Node = function assertNode(value) {
    assert(value instanceof net.Node, "Not a Node.", TypeError);
};

_.assert.Edge = function assertEdge(value) {
    assert(value instanceof net.Edge, "Not an Edge.", TypeError);
};

_.assert.Message = function assertMessage(value) {
    assert(value instanceof net.Message, "Not a Message.", TypeError);
};

_.assert.Model = function assertModel(value) {
    assert(value instanceof net.Model, "Not a Model.", TypeError);
};

_.assert.Network = function assertNetwork(value) {
    assert(value instanceof net.Network, "Not a Network.", TypeError);
};

_.assert.Entity = function assertEntity(value) {
    assert(value instanceof net.Entity, "Not an Entity.", TypeError);
};

_.assert.Relation = function assertRelation(value) {
    assert(value instanceof net.Relation, "Not an Relation.", TypeError);
};

_.promify = function promify(fn, ...args) {
    return new Promise((resolve, reject) => fn(...args, (err, result) => err ? reject(err) : resolve(result)));
};

let logCount = 0;
_.log = function log(scope, method, ...args) {
    let raw = '', color = '', silent = false, colored = true;

    if (_.is.string(scope)) {
        raw = scope;
        color = colors.yellow(scope);
    } else if (_.is.object(scope) && _.is.string(method) && Reflect.has(scope, method)) {
        let scopeName = scope.__proto__.constructor.name, scopeData = _.is.string(scope.id) ? scope.id : JSON.stringify(scope.data) || '';
        let argPairs = args.map(arg => [arg === undefined ? 'undefined' : arg === null ? 'null' : arg.__proto__.constructor.name, !arg ? '' : _.is.string(arg.id) ? arg.id : JSON.stringify(arg.data) || '']);

        raw = `${scopeName}<${scopeData}>.${method}(${argPairs.map(([argName, argData]) => `${argName}<${argData}>`).join(', ')})`;
        color = colors.cyan(scopeName) + colors.grey('<') + colors.green(scopeData) + colors.grey('>')
            + colors.grey('.') + colors.magenta(method) + colors.grey('(')
            + argPairs.map(([argName, argData]) =>
                colors.blue(argName) + (argData ? colors.grey('<') + colors.green(argData) + colors.grey('>') : '')
            ).join(colors.grey(', '))
            + colors.grey(')');
    } else {
        return null;
    }

    raw = `log[${logCount}]: ` + raw;
    color = colors.grey(`log[${logCount}]: `) + color;
    logCount++;

    if (!silent) console.log(colored ? color : raw);
    return raw;
};