const { Node, Edge, Message, Model, Network, Entity, Neuron, ODRLModel, Neo4jStore } = require(".");

let n1 = new Node("n1");
let n2 = new Entity({ uid: "n2", type: ["Entity"] });
let n3 = new Node("n3");
let e1 = new Edge(n1, n2, "e1");
let e2 = new Edge(n2, n3, ["e2"]);
let m1 = new Message("m1");
n1.emit(m1);