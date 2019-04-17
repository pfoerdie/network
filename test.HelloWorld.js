const Node = require('.').Node;

let n0 = new Node({ name: "Lorem Ipsum" });
let n1 = new Node(null);

n0
    .attach(n1)
    .on('test', function () {
        this.emit('next', "Hello World!");
        console.log(this.data.name);
    })
    .once('test2', function () {
        this.emit('next', "Hello You!");
    })
    .trigger('test');

n1
    .on('next', function (message) {
        console.log(message);
        this.emit('test2');
    })
    .attach(n0);