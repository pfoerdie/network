const Node = require('.').Node;

const counter = {
    _DELAY: 1e3,
    _DURATION: 6e3,
    _count: 0,
    _loop: null,
    _ts: 0,
    _loopCB() {
        let ts = Date.now();
        console.log("freq:", Math.round(counter._count / (ts - counter._ts)), "KHz");
    },
    _finishCB() {
        console.log("count:", counter._count.toLocaleString());
        process.exit();
    },
    increase() {
        counter._count++;
    },
    start() {
        if (counter._loop) counter.end();
        counter._loop = setInterval(counter._loopCB, counter._DELAY);
        counter._count = 0;
        counter._ts = Date.now();
        setTimeout(counter.end, counter._DURATION);
    },
    end() {
        clearInterval(counter._loop);
        counter._loop = null;
        counter._finishCB();
    }
};

const SIZE = 1e3;
const nodes = [];
console.log("type:", "chain");
console.log("size:", SIZE.toLocaleString());
console.time("build network");
for (let i = 0; i < SIZE; i++) {
    nodes.push(
        new Node({ id: "n" + i })
            .on('spread', function (prevID) {
                counter.increase();
                this.emit('spread', this.data.id);
            })
    );
    if (i > 0)
        nodes[i].attachTo(nodes[i - 1]);
}
nodes[0].attachTo(nodes[SIZE - 1]);
console.timeEnd("build network");

counter.start();
nodes[0].trigger('spread');