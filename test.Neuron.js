const Neuron = require('.').Neuron;
main().catch(console.error);

async function main() {

    // NOTE not as expected but very interesting
    // TODO need to find a good mechanism for delegating the changes to the network
    // IDEA maybe by building layer instead of individual neurons
    // IDEA maybe a network class that manages the neurons

    let n0 = new Neuron(1);
    let n1 = new Neuron(1);
    let n2 = new Neuron(1);
    let n3 = new Neuron(1);

    n0.attach(n1, 1);
    n1.attach(n2, 1).attach(n3, 2);

    n0.value = 2;

    for (let i = 0, n = 5; i < n; i++) {
        console.log(`values [${i}]:`);
        console.log(n0.value);
        console.log(n1.value);
        console.log(n2.value);
        console.log(n3.value);
        await n0.cycle(10);
        n0.value = 0;
    }

} // main

