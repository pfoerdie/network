const _ = require("./tools.js");

// private
_.define(exports, "private", new WeakMap());
_.define(exports, "package", new WeakMap());
_.define(exports, "instances", new Map());
_.define(exports, "secret", Symbol());

// core
_.enumerate(exports, "Node", require("./Node.js"));
_.enumerate(exports, "Edge", require("./Edge.js"));
_.enumerate(exports, "Message", require("./Message.js"));

// extensions
_.enumerate(exports, "Neuron", require("./Neuron.js"));
_.enumerate(exports, "Signal", require("./Signal.js"));

_.enumerate(exports, "Entity", require("./Entity.js"));

// extras
_.enumerate(exports, "toJSON", function () {
    return Array.from(exports.instances.values()).map(instance => instance.toJSON());
});
_.enumerate(exports, "fromJSON", function (arr) {
    _.assert(_.is.array(arr) && arr.every(_.is.object), "arr is not an array of objects");
    arr.filter(val => val.type === "Node").forEach(val => new exports.Node(val.data, exports.secret, val.uid));
    arr.filter(val => val.type === "Neuron").forEach(val => new exports.Neuron(val.data, exports.secret, val.uid));

    arr.filter(val => val.type === "Edge").forEach(val => new exports.Edge(val.from, val.to, val.data, exports.secret, val.uid));

    arr.filter(val => val.type === "Message").forEach(val => new exports.Message(val.data, exports.secret, val.uid));
    arr.filter(val => val.type === "Signal").forEach(val => new exports.Signal(val.data, exports.secret, val.uid));
});