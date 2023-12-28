import cluster from "cluster";
import os from "os";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const cpuCount = os.cpus().length;

console.log(`CPU Count: ${cpuCount}`);
console.log(`PID: ${process.pid}`);

cluster.setupPrimary({
    exec: __dirname + '/server/src/index.js'
});

const temp = new Map();

cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} killed`);
    console.log("Starting another worker");
    cluster.fork();
});

// Listen for messages from other workers
cluster.on('message', (worker, message) => {
    if (message.type === 'updateTemp') {
        const { prop, prop2 } = message.data;
        temp.set(prop, prop2);
    } else if (message.type === 'deleteTemp') {
        const { prop } = message.data;
        temp.delete(prop);
    }
});

for (let i = 0; i < cpuCount; i++) {
    cluster.fork();
}