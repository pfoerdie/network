const Path = require("path"), Fs = require("fs");
const Network = require(".");

let data = Fs.readFileSync(Path.join(__dirname, "test.json"));
Network.fromJSON(JSON.parse(data));

console.log(Network.toJSON());