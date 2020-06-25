// like Node, Edge/Relation/Connection, Message
const { Neuron, Axon, Signal } = require("."), random = (min = 0, max = 1) => min + ((max - min) * Math.random());

let
    n0 = new Neuron(random()),
    n1 = new Neuron(random()),
    n2 = new Neuron(random()),
    n3 = new Neuron(random()),
    n4 = new Neuron(random()),
    a0_1 = new Axon(n0, n1, random()),
    a0_3 = new Axon(n0, n3, random()),
    a1_2 = new Axon(n1, n2, random()),
    // a3_2 = new Axon(n3, n2, random()),
    a2_4 = new Axon(n2, n4, random()),
    // a3_1 = new Axon(n3, n1, random()),
    s0_2 = new Signal([n0], [n2]);

s0_2.start([1]);