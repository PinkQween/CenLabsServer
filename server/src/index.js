const express = require('express');
const https = require('https');
const fs = require('fs');
const yargs = require('yargs');
const readline = require('readline');

const rl = readline.createInterface(process.stdin, process.stdout);

const app = express();

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

function domainAndIPMiddleware(req, res, next) {
    const hostname = req.hostname;
    const ip = req.ip;

    // console.log(hostname)

    // Check the domain
    if (hostname === 'cendrive.com' || hostname === 'www.cendrive.com') {
        require('./Centillion Drive/detailedServer.js');
    } else if (hostname === 'db.cendrive.com') {
        // app.use(requireHTTP);
        require('./Centillion Drive DB/detailedServer.js');
    } else if (hostname === 'auth.cendrive.com') {
        // app.use(requireHTTP);
        require('./Centillion Labs Auth/detailedServer.js');
    } else if (hostname === 'proxy.cendrive.com') {
        require('./Centillion Drive Proxy/detailedServer.js');
    } else if (hostname === 'cats-buy.cendrive.com' || hostname === 'cats.cendrive.com') {
        require('./Cat Stack Stripe/detailedServer.js');
    } else {
        // Handle a special case for a specific IP address
        return res.send('Special case');
    }

    // If no special case is triggered, proceed to the next middleware
    next();
}

app.use(domainAndIPMiddleware);

// app.get('/', (req, res) => {
//     res.redirect('https://www.cendrive.com/')
// })

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

const startAllBots = require('./bot/startAllBots.js')

if (!argv.dontStartBots) {
    startAllBots(argv.botsToNotStart)
}