const { Node, Edge, Message } = require(".");

let n1 = new Node({ id: "hello_world" });
let n2 = new Node({ id: "lorem_ipsum" });

console.log(n1.data, n2);

for (let child of n1) {
    console.log(child);
}