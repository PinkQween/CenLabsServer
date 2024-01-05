import cluster from "cluster";
import os from "os";
import { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cpuCount = os.cpus().length;

console.log(`CPU Count: ${cpuCount}`);
console.log(`PID: ${process.pid}`);

// Read the ports from the config file
const configFile = 'serverConfig.json';
const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
const ports = config.ports;

// // Kill existing processes on specified ports
// for (const serviceName in ports) {
//     const port = ports[serviceName];
//     // Execute command to kill the process using the specified port
//     // Note: You might need to adjust the command based on your OS (this is a Linux example)
//     const killCommand = `lsof -t -i:${port} | xargs kill -9`;
//     try {
//         // Run the command to kill the process
//         execSync(killCommand);
//         console.log(`Killed process on port ${port}`);
//     } catch (error) {
//         console.error(`Error killing process on port ${port}:`, error.message);
//     }
// }

for (const serviceName in ports) {
    const port = ports[serviceName];
    killProcessOnPort(port)
}

function killProcessOnPort(port) {
    try {
        // Use lsof to find the process ID (PID) using the specified port
        const pid = execSync(`lsof -ti tcp:${port}`);

        // Use kill command to terminate the process
        execSync(`kill -9 ${pid}`);

        console.log(`Successfully killed process on port ${port}.`);
    } catch (error) {
        console.error(`Error killing process on port ${port}: ${error.stderr ? error.stderr.toString() : error.toString()}`);
    }
}

// Setup primary cluster
cluster.setupPrimary({
    exec: __dirname + '/server/src/index.js'
});

const temp = new Map();

// Event handling for worker exit and messages
cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} killed`);
    
    for (const serviceName in ports) {
        const port = ports[serviceName];
        killProcessOnPort(port)
    }

    console.log("Starting another worker");
    cluster.fork();
});

cluster.on('message', (worker, message) => {
    if (message.type === 'updateTemp') {
        const { prop, prop2 } = message.data;
        temp.set(prop, prop2);
    } else if (message.type === 'deleteTemp') {
        const { prop } = message.data;
        temp.delete(prop);
    }
});

// Fork workers based on CPU count
for (let i = 0; i < cpuCount; i++) {
    cluster.fork();
}
