const Node = require('.').Node;

let
    count = 0,
    sum = 0,
    iterations = 0,
    duration = 1e3,
    networkSize = 1e3,
    time = 10e3,
    interval = null;

let
    n1 = new Node({ name: "Lorem Ipsum" }),
    n2 = new Node(null);

n1
    .attach(n2)
    .on('test', function () {
        this.emit('test', "Hello World!");
        console.log(this.data.name);
    })
    .trigger('test');

n2
    .attach(n1)
    .on('test', function (str) {
        console.log(str);
        console.log(this);
    });

function countUp(lastCount) {
    count++;
    this.emit('count', count);
}

class Counter extends Node {
    constructor(index) {
        super({ index });
        this.on('count', countUp);
    }
}

console.time("build network");
let network = [new Counter(0)];
for (let i = 1; i < networkSize; i++) {
    network.push(
        new Counter(i)
            .attachTo(network[i - 1])
    );
}
network[0]
    .attachTo(network[network.length - 1])
    // .attachTo(network[1])
    // .attachTo(network[Math.trunc(Math.random() * network.length)])
    ;
console.timeEnd("build network");
network[0].trigger('count', 0);

// display counter
interval = setInterval(() => {
    iterations++;
    sum += count;
    if (iterations * duration <= time) {
        console.log(Math.round(count / duration) + " KHz");
        count = 0;
    } else {
        console.log("avg: " + Math.round(100 * sum / iterations / duration) / 100 + " KHz");
        clearInterval(interval);
        process.exit(0);
    }
}, duration);