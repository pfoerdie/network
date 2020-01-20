const _ = require("../tools.js");

const uids = new Set();
_.define(exports, "generateUID", function (id) {
    let uid = _.is.String(id) ? id : _.uuid();
    while (uids.has(uid)) { uid = _.uuid(); }
    return uid;
});

_.enumerate(exports, "Node", require("./Node.js"));
_.enumerate(exports, "Edge", require("./Edge.js"));
_.enumerate(exports, "Network", require("./Network.js"));


_.enumerate(exports, "Neuron", require("./Neuron.js"));