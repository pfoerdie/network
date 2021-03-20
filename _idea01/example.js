const Path = require("path"), Fs = require("fs");
const { Node, Message, Edge, Neuron, Signal } = Network = require(".");
const { secret } = require("./module.js");

let n0 = new Node({ test: "hello world" }, secret, "HELLO_WORLD");
let n1 = new Node(null, secret, "TEST");
let e0 = new Edge(n0, n1, null, secret, "LOREM_IPSUM");
let m0 = new Message(null, secret, "MESSAGE");

// console.log(n0.toJSON());
// console.log(n1.toJSON());
// console.log(m0.toJSON());
// console.log(e0.toJSON());

Fs.writeFileSync(Path.join(__dirname, "test.json"), JSON.stringify(Network, null, "\t"));