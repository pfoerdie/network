const { Network, Node, Edge } = require(".");

let network0 = new Network();

let node0 = new Node({ msg: "Hello World!" });
let node1 = new Node();

network0.addInput(node0);
network0.addOutput(node1);
let edge0 = node0.attach(node1, { msg: "Lorem Ipsum" });
// edge0.delete(true);

console.log(Array.from(network0.inputs)[0].outputs);
console.log(node1.inputs);

let tmp0 = Array.from(Array.from(network0.inputs)[0].outputs)[0];
let tmp1 = Array.from(node1.inputs)[0];
console.log("equal?", tmp0 && tmp0 === tmp1 ? "NICE" : "NOOO", tmp0 ? tmp0.data : "nothing");

console.log(JSON.stringify({ node0, node1 }, null, 2));