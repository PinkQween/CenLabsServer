// const http2 = require("http2");
// const fs = require("fs");

// /* 
//   Use 'https://api.push.apple.com' for production build
// */

// const deviceToken =
//     "3be968aeb54b4a72480e3e2ac649495244db336734ef721d26a6130d44d77acb";
// host = "https://api.push.apple.com";
// path = "/3/device/" + deviceToken;

// /*
// Using certificate converted from p12.
// The code assumes that your certificate file is in same directory.
// Replace/rename as you please
// */

// const client = http2.connect(host, {
//     key: fs.readFileSync(__dirname + "/certs/cert.jey.pem"),
//     cert: fs.readFileSync(__dirname + "/certs/cert.crt.pem"),
// });

// client.on("error", (err) => console.error(err));

// body = {
//     aps: {
//         alert: "hello Hanna",
//         "content-available": 1,
//     },
// };

// headers = {
//     ":method": "POST",
//     "apns-topic": "com.cendrive.SoulSync", //you application bundle ID
//     ":scheme": "https",
//     ":path": path,
// };

// const request = client.request(headers);

// request.on("response", (headers, flags) => {
//     for (const name in headers) {
//         console.log(`${name}: ${headers[name]}`);
//     }
// });

// request.setEncoding("utf8");

// let data = "";
// request.on("data", (chunk) => {
//     data += chunk;
// });
// request.write(JSON.stringify(body));
// request.on("end", () => {
//     console.log(`\n${data}`);
//     client.close();
// });
// request.end();


const express = require('express');
const http2 = require('http2');
const fs = require('fs');
const bodyParser = require('body-parser');
require('dotenv').config();

// const deviceToken =
//     'd275e0c619c74d6a566d751a30606a92e5cdb7f3633b63085019f597f3b19d70';
const hostProd = 'https://api.push.apple.com';
const hostDev = 'https://api.sandbox.push.apple.com';

function sendPushNotification(notificationMessage, deviceToken, client, path) {
    const body = {
        aps: {
            alert: notificationMessage,
            'content-available': 1,
        },
    };

    const headers = {
        ':method': 'POST',
        'apns-topic': 'com.cendrive.SoulSync', // your application bundle ID
        ':scheme': 'https',
        ':path': path,
    };

    const request = client.request(headers);

    request.on('error', (err) => {
        console.error('Request error:', err);
        if (!client.closed) {
            client.close();
        }
    });

    request.on('response', (headers, flags) => {
        for (const name in headers) {
            console.log(`${name}: ${headers[name]}`);
        }
    });

    request.setEncoding('utf8');

    let data = '';
    request.on('data', (chunk) => {
        data += chunk;
    });

    request.write(JSON.stringify(body));

    request.on('end', () => {
        console.log(`\n${data}`);
        if (!client.closed) {
            client.close();
        }
    });

    request.on('close', () => {
        console.log('Request closed');
        if (!client.closed) {
            client.close();
        }
    });

    // Ensure that the request is properly ended
    request.end();
}



module.exports = {
    setupRoutes: (app) => {
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(express.json());

        app.get('/', (req, res) => {
            res.sendFile(__dirname + '/test/index.html');
        });

        app.post('/send-notification', (req, res) => {
            const { message, deviceToken, environmentValue } = req.body;

            const host = environmentValue == "dev" ? hostDev : hostProd

            const path = '/3/device/' + deviceToken;


            const client = http2.connect(host, {
                key: fs.readFileSync(__dirname + '/certs/cert.key.pem'),
                cert: fs.readFileSync(__dirname + '/certs/cert.crt.pem'),
                passphrase: process.env.PUSH_PHRASE
            });

            // Trigger the push notification
            sendPushNotification(message, deviceToken, client, path);

            console.log(message, deviceToken, host, path)

            res.send("OK")
        });
    },
};