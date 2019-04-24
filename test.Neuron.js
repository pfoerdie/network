const Neuron = require('.').Neuron;
main().catch(console.error);

async function main() {

    let n0 = new Neuron(1);
    let n1 = new Neuron(2);
    let n2 = new Neuron(2);
    let n3 = new Neuron(2);

    n0.attach(n1, 1);
    n1.attach(n2, 1).attach(n3, 2);

    n0.value = 100;

    await n0.cycle();
    await n0.cycle();
    await n0.cycle();

    console.log(n0.value);
    console.log(n1.value);
    console.log(n2.value);
    console.log(n3.value);

} // main

