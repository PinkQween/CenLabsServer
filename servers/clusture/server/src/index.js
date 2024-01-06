const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path')
const yargs = require('yargs');
const readline = require('readline');
const socketIo = require('socket.io');
const speakeasy = require('speakeasy');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const csrf = require('csurf');

const temporarilyAllowedIPs = new Map()

process.on('message', (message) => {
    if (message.type === 'updateTemp') {
        const { prop, prop2 } = message.data;
        temporarilyAllowedIPs.set(prop, prop2);
    } else if (message.type === 'deleteTemp') {
        const { prop } = message.data;
        temporarilyAllowedIPs.delete(prop);
    }
});

const app = express();

app.disable('x-powered-by');
app.use(cors())
app.use(fileUpload())
app.use(express.json())

app.use(bodyParser.urlencoded({ extended: true }));

// Path to store user data
const userFilePath = __dirname + '/../db/other/ipusers.json'

console.log(userFilePath)

// Object to store data preeminently (replace this with your actual data)
const adminIpRestrictorsInfo = [
    {
        email: 'hanna@cendrive.com',
        password: '3632',
    },
    {
        email: 'bradley@cendrive.com',
        password: 'idk',
    },
];

// Load existing user data from the JSON file
let users = {};
try {
    const data = fs.readFileSync(userFilePath, 'utf8');
    users = JSON.parse(data);
} catch (error) {
    console.error('Error reading user data file:', error.message);
}

// Map to store temporarily allowed IPs
// console.log(cluster.Worker())
// let temporarilyAllowedIPs = tempIP.getTemp()
// temporarilyAllowedIPs.set = tempIP.setTemp
// temporarilyAllowedIPs.delete = tempIP.delateTemp
// temporarilyAllowedIPs.has = tempIP.tempHas

// Middleware to check IP and authenticate admin
function authenticateAdmin(req, res, next) {
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Check if the IP is temporarily allowed
    if (!temporarilyAllowedIPs.has(clientIp)) {
        return res.status(403).send('Access denied');
    }

    // Check if the request contains valid admin credentials
    const { email, password } = req.body;
    const isAdmin = adminIpRestrictorsInfo.some(info => info.email === email && info.password === password);

    if (isAdmin) {
        next();
    } else {
        res.status(401).send('Invalid admin credentials');
    }
}

// Middleware to temporarily allow IP for an hour
function temporarilyAllowIP(req, res, next) {
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Allow the IP for an hour
    temporarilyAllowedIPs.set(clientIp, true);
    setTimeout(() => {
        temporarilyAllowedIPs.delete(clientIp);
    }, 3600000); // 1 hour in milliseconds

    next();
}

// Middleware to handle domain and IP restrictions
function domainAndIPMiddleware(req, res, next) {
    const hostname = req.hostname;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;


    //   res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    //   res.setHeader('Pragma', 'no-cache');
    //   res.setHeader('Expires', 0);

    console.log(ip);

    app.use(requireHTTPS)

    // Define the allowed IP addresses for each domain
    const allowedIPs = {
        // '*': ['69.131.138.130', '91.229.244.11', '98.178.149.37', '2600:8804:5a14:a100:7dcd:9918:3307:fac4', '198.58.110.234', '2600:8804:5a14:a100:8944:efea:cb13:7bd1', '98.178.149.37', '198-58-110-234.ip.linodeusercontent.com', '2605:b40:1113:4600:299c:ec8d:2735:6c56', '2600:3c00::f03c:93ff:fe98:9384', '2605:b40:1113:4600:9968:d364:7141:503a', '2605:b40:1113:4600:65d0:5c09:472f:7d97', "198.58.110.234", '2605:b40:1113:4600:20a8:2e0b:ba97:973b', '111.172.249.49'], // Allow these IP addresses for all domains
        // 'cendrive.com': ['192.168.1.3', '192.168.1.4'],
        // 'db.cendrive.com': ['192.168.1.5'],
        // Add other domains and their allowed IP addresses as needed
        // '*': ['91.229.244.11'], // Allow these IP addresses for all domains
        '*': ['*']
    };

    console.log(temporarilyAllowedIPs)

    console.log(allowedIPs)

    console.log(hostname)

    console.log(allowedIPs['*'])

    // Check if the IP is allowed for the specified domain or is temporarily allowed
    if (
        (allowedIPs['*'] && allowedIPs['*'].includes(ip)) ||
        (allowedIPs['*'] && allowedIPs['*'].includes('*')) ||
        (allowedIPs[hostname] && allowedIPs[hostname].includes(ip)) ||
        (allowedIPs[hostname] && allowedIPs[hostname].includes('*')) ||
        temporarilyAllowedIPs.has(ip)
    ) {
        console.log('authed')
        // // The IP is allowed for the specified domain or is temporarily allowed
        // if (hostname === 'cendrive.com' || hostname === 'www.cendrive.com') {
        //     require('./Centillion Drive/detailedServer.js').setupRoutes(app);
        // } else if (hostname === 'db.cendrive.com') {
        //     require('./Centillion Drive DB/detailedServer.js').setupRoutes(app);
        // } else if (hostname === 'auth.cendrive.com') {
        //     require('./Centillion Labs Auth/detailedServer.js').setupRoutes(app);
        // } else if (hostname === 'proxy.cendrive.com') {
        //     require('./Centillion Drive Proxy/detailedServer.js').setupRoutes(app);
        // } else if (hostname === 'cats-buy.cendrive.com' || hostname === 'cats.cendrive.com') {
        //     require('./Cat Stack Stripe/detailedServer.js').setupRoutes(app);
        // } else if (hostname === 'search.cendrive.com') {
        //     require('./Centillion Labs Search/detailedServer.js').setupRoutes(app);
        // } else {
        //     res.send('Special case');
        // }
        // // If no special case is triggered, proceed to the next middleware
        next();
    } else {
        console.log('not authed')
        // IP is not allowed for the specified domain
        return res.send(`
    <html>
      <body>
        <form action="/verifyTOTP" method="post">
        <label>Enter username: </label><input type="text" name="username"><br>
        <label>Enter TOTP Code: </label><input type="text" name="totpCode"><br>
          <button type="submit">Submit</button>
        </form>
        <a href="https://cendrive.com/generateTOTP">
            Don't have a user? click here
        </a>
      </body>
    </html>
  `);
    }
}

// Route to verify TOTP code
app.post('/verifyTOTP', (req, res) => {
    const { totpCode, username } = req.body;

    console.log(username);

    const user = users[username];

    if (!user || !user.secret) {
        return res.status(401).send('Invalid user. Access denied.');
    }

    // Log the user.secret details
    console.log('user.secret:', user.secret);
    console.log(typeof user.secret)

    // Check if the TOTP code is valid
    const isValidTOTP = speakeasy.totp.verify({
        secret: user.secret, // Pass the base32 property
        // encoding: 'base32',
        token: totpCode,
    });

    console.log(req.headers['x-forwarded-for'] || req.connection.remoteAddress)

    if (isValidTOTP) {
        temporarilyAllowedIPs.set(req.headers['x-forwarded-for'], true);
        setTimeout(() => {
            temporarilyAllowedIPs.delete(req.headers['x-forwarded-for']);
        }, 3600000); // 1 hour in milliseconds
        res.send('Temporary access granted!');
    } else {
        res.status(401).send('Invalid TOTP code. Access denied.');
    }
});


// Route to display the login form
app.get('/generateTOTP', temporarilyAllowIP, (req, res) => {
    res.send(`
        <html>
            <body>
                <form action="/generateTOTP" method="post">
                    <label>Username: </label><input type="text" name="username"><br>
                    <label>Email: </label><input type="text" name="email"><br>
                    <label>Password: </label><input type="password" name="password"><br>
                    <button type="submit">Submit</button>
                </form>
            </body>
        </html>
  `);
});

// Route to generate TOTP for the specified user
app.post('/generateTOTP', authenticateAdmin, (req, res) => {
    const { username } = req.body;

    // Check if the user already exists
    if (users[username]) {
        return res.status(400).send('User already exists');
    }

    // Generate a secret key for the user
    const secret = speakeasy.generateSecret({ length: 20 }).base32;

    // Save the secret key to the users object
    users[username] = { secret };

    // Save the updated user data to the JSON file
    saveUsersToFile(users);

    // Generate QR code for the user to scan
    const otpAuthUrl = speakeasy.otpauthURL({ secret, label: 'Centillion Labs', issuer: 'Centillion Labs' });

    encodeURIComponent
    const qrCode = `https://chart.googleapis.com/chart?chs=200x200&chld=M|0&cht=qr&chl=${(otpAuthUrl)}`;

    // Display the QR code on the website
    res.send(`
    <html>
      <body>
        <img src="${qrCode}" alt="QR Code for ${username}" />
        <p>${otpAuthUrl}</p>FF
        <a href="https://cendrive.com">
            Done? head back to the original site you we're trying to visit or click here for out drive app
        </a>
      </body>
    </html>
  `);
});

// Save users to JSON file
function saveUsersToFile(users) {
    fs.writeFileSync(userFilePath, JSON.stringify(users, null, 2), 'utf8');
}

app.use(domainAndIPMiddleware)

const rl = readline.createInterface(process.stdin, process.stdout);

// Define command-line arguments using yargs
const argv = yargs
    .option('p', {
        alias: 'http-port',
        description: 'HTTP port number',
        type: 'number',
        default: 80,
    })
    .option('s', {
        alias: 'https-port',
        description: 'HTTPS port number',
        type: 'number',
        default: 443,
    })
    .option('dontEnforceHttps', {
        description: 'doesn\'t enforce HTTPS',
        type: 'boolean',
        default: false
    })
    .option('dontStartBots', {
        description: 'doesn\'t start any of the bots',
        type: 'boolean',
        default: false
    })
    .option('botsToNotStart', {
        description: 'The bots to exclude from startup',
        type: 'array',
        default: []
    })
    .help()
    .alias('help', 'h')
    .argv;

// Check if HTTPS should be enforced
if (!argv.dontEnforceHttps) {
    app.use(requireHTTPS);
}

function requireHTTPS(req, res, next) {
    // The 'x-forwarded-proto' check is for Heroku
    if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
        return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
}

function requireHTTP(req, res, next) {
    // The 'x-forwarded-proto' check is for Heroku
    return res.redirect('http://' + req.get('host') + req.url);
    next();
}



module.exports = app;

// function domainAndIPMiddleware(req, res, next) {
//     const hostname = req.hostname;
//     // const ip = req.ip;
//     const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

//     console.log(ip)

//     // Define the allowed IP addresses for each domain
//     const allowedIPs = {
//         '*': ['69.131.138.130', '91.229.244.11'], // Allow these IP addresses for all domains
//         // 'cendrive.com': ['192.168.1.3', '192.168.1.4'],
//         // 'db.cendrive.com': ['192.168.1.5'],
//         // Add other domains and their allowed IP addresses as needed
//     };

//     // Check the domain
//     if ((allowedIPs['*'] && allowedIPs['*'].includes(ip)) || (allowedIPs[hostname] && allowedIPs[hostname].includes(ip))) {
//         // The IP is allowed for the specified domain
//         if (hostname === 'cendrive.com' || hostname === 'www.cendrive.com') {
//             require('./Centillion Drive/detailedServer.js');
//         } else if (hostname === 'db.cendrive.com') {
//             // app.use(requireHTTP);
//             require('./Centillion Drive DB/detailedServer.js');
//         } else if (hostname === 'auth.cendrive.com') {
//             // app.use(requireHTTP);
//             require('./Centillion Labs Auth/detailedServer.js');
//         } else if (hostname === 'proxy.cendrive.com') {
//             require('./Centillion Drive Proxy/detailedServer.js');
//         } else if (hostname === 'cats-buy.cendrive.com' || hostname === 'cats.cendrive.com') {
//             require('./Cat Stack Stripe/detailedServer.js');
//         } else if (hostname === 'search.cendrive.com') {
//             require('./Centillion Labs Search/detailedServer.js');
//         } else {
//             res.send('Special case')
//         }
//         // If no special case is triggered, proceed to the next middleware
//         next();
//     } else {
//         // IP is not allowed for the specified domain
//         return res.status(304).send('Access denied');
//     }
// }


// app.use(domainAndIPMiddleware);

// app.get('/', (req, res) => {
//     res.redirect('https://www.cendrive.com/')
// })

const appDrive = express();
const appDriveDB = express();
const appAuth = express();
const appProxy = express();
const appCat = express();
const appSearch = express();
const appSoulSync = express()
const appSoulSyncDev = express()
const appNotifyTest = express()
// Set up routes for each service
require('./Centillion Drive/detailedServer.js').setupRoutes(appDrive);
require('./Centillion Drive DB/detailedServer.js').setupRoutes(appDriveDB);
require('./Centillion Labs Auth/detailedServer.js').setupRoutes(appAuth);
require('./Centillion Drive Proxy/detailedServer.js').setupRoutes(appProxy);
require('./Cat Stack Stripe/detailedServer.js').setupRoutes(appCat);
require('./Centillion Labs Search/detailedServer.js').setupRoutes(appSearch);
require('./SoulSync/detailedServer.js').setupRoutes(appSoulSync);
require('./SoulSync (dev tests)/detailedServer.js').setupRoutes(appSoulSyncDev);
require('./notify.test.js').setupRoutes(appNotifyTest);

// Listen on different ports for each service
const ports = {
    drive: 3001,
    driveDB: 3002,
    auth: 3003,
    proxy: 3004,
    cat: 3005,
    search: 3006,
    soulSync: 3007,
    soulSyncDev: 3008,
    notifyTest: 3009
};

const allServerDetails = {
    drive: {
        port: ports.drive,
        domains: ["www.cendrive.com", "cendrive.com"]
    },
    driveDB: {
        port: ports.driveDB,
        domains: ["db.cendrive.com"]
    },
    auth: {
        port: ports.auth,
        domains: ["auth.cendrive.com"]
    },
    proxy: {
        port: ports.proxy,
        domains: ["proxy.cendrive.com"]
    },
    cat: {
        port: ports.cat,
        domains: ["cats-buy.cendrive.com"]
    },
    search: {
        port: ports.search,
        domains: ["search.cendrive.com"]
    },
    soulSync: {
        port: ports.soulSync,
        domains: ["ss.cendrive.com"]
    },
    soulSyncDev: {
        port: ports.soulSyncDev,
        domains: ["dev-ss.cendrive.com"]
    },
    notifyTest: {
        port: ports.notifyTest,
        domains: ["push.cendrive.com"]
    }
}

appDrive.listen(ports.drive, () => {
    console.log(`Centillion Drive is running on http://localhost:${ports.drive}`);
});

appDriveDB.listen(ports.driveDB, () => {
    console.log(`Centillion Drive DB is running on http://localhost:${ports.driveDB}`);
});

appAuth.listen(ports.auth, () => {
    console.log(`Centillion Labs Auth is running on http://localhost:${ports.auth}`);
});

appProxy.listen(ports.proxy, () => {
    console.log(`Centillion Drive Proxy is running on http://localhost:${ports.proxy}`);
});

appCat.listen(ports.cat, () => {
    console.log(`Cat Stack Stripe is running on http://localhost:${ports.cat}`);
});

appSearch.listen(ports.search, () => {
    console.log(`Centillion Labs Search is running on http://localhost:${ports.search}`);
});

appSoulSync.listen(ports.soulSync, () => {
    console.log(`SoulSync is running on http://localhost:${ports.soulSync}`);
});

appSoulSyncDev.listen(ports.soulSyncDev, () => {
    console.log(`SoulSync (dev tests) is running on http://localhost:${ports.soulSyncDev}`);
});

appNotifyTest.listen(ports.notifyTest, () => {
    console.log(`Notify Test is running on http://localhost:${ports.notifyTest}`);
});

app.all('*', async (req, res) => {
    const hostname = req.hostname;
    const method = req.method;
    const pathOfUri = req.path;

    try {
        const targetServer = Object.values(allServerDetails).find(server =>
            server.domains.includes(hostname)
        );

        if (!targetServer) {
            return res.status(404).json({ success: false, message: 'Server not found' });
        }

        const targetDetails = Object.values(targetServer)
            .map(serverDetails => serverDetails)
            .find(details => {
                console.log(typeof details)
                if (typeof details == "number") {
                    return details
                } else {
                    return false
                }
            });

        if (!targetDetails) {
            return res.status(404).json({ success: false, message: 'Details not found for the target server' });
        }

        const targetURL = `http://198.58.110.234:${targetDetails}${pathOfUri}`;

        console.log(targetURL)
        console.log("Body: " + JSON.stringify(req.body))

        console.log(`AUTHGHHHHH; ${req.header('Authorization')}`)
        console.log(req.headers)

        const fetchOptions = {
            method, // Forward the original HTTP method
            headers: {
                'Authorization': req.header('Authorization'), // Include 'Authorization' header if it exists
                ...(method !== "GET" && { 'Content-Type': 'application/json' }), // Include 'Content-Type' header for non-GET requests
            },
            body: method !== "GET" ? JSON.stringify(req.body) : undefined,
        };


        console.log(fetchOptions)

        try {
            const response = await fetch(targetURL, fetchOptions);
            response.headers.forEach((value, name) => {
                console.log(name, value)
                res.setHeader(name, value);
            });

            console.log(response)

            res.status(response.status).send(await response.text());
        } catch (err) {
            console.log(err)
            await fetch(targetURL, fetchOptions);
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
})

function createFormData(req) {
    const formData = new FormData();
    // Append files from req.files
    for (const file of Object.values(req.files)) {
        formData.append('file', file.data);
    }
    // Append other form data from req.body
    for (const [key, value] of Object.entries(req.body)) {
        formData.append(key, value);
    }
    return formData;
}

const privateKey = fs.readFileSync('/etc/letsencrypt/live/cendrive.com-0001/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/cendrive.com-0001/cert.pem', 'utf8');

const credentials = { key: privateKey, cert: certificate };

// Create an HTTPS server
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(argv.httpsPort, () => {
    console.log(`Server is running on https://localhost:${argv.httpsPort}`);
});

app.listen(argv.httpPort, () => {
    console.log(`Server is running on http://localhost:${argv.httpPort}`);
});

const startAllBots = require('./bot/startAllBots.js');
const { hostname } = require('os');
const { CommandInteractionOptionResolver } = require('discord.js');
if (!argv.dontStartBots) {
    startAllBots(argv.botsToNotStart)
}

const io = socketIo(httpsServer)