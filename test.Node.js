const Node = require('.').Node;

let
    n1 = new Node({ name: "Lorem Ipsum" }),
    n2 = new Node(null),
    count = 0,
    sum = 0,
    iterations = 0,
    duration = 1e3,
    time = 10e3,
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

n1
    .attach(n2)
    .on('test', function () {
        this.emit('test', "Hello World!");
        // console.log(this.data.name);
        count++;
    })
    .trigger('test');

n2
    .attach(n1)
    .on('test', function (str) {
        // console.log(str);
        this.emit('test');
        count++;
    });