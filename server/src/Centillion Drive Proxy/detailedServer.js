process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; 

const app = require('../index');
const cors = require('cors');
const express = require('express');

app.use(express.json());
app.use(cors());

app.get('/auth/*', async (req, res) => {
    try {
        const fetch = await import('node-fetch');

        const response = await fetch.default(`https://auth.cendrive.com/${req.params[0]}`, {
            method: 'GET',
            headers: {
                // Forward all headers from the incoming request
                ...req.headers,
            },
            // Include credentials (cookies) with the request
            credentials: 'include',
        });

        res.status(response.status).json(await response.json());
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/auth/*', async (req, res) => {
    try {
        const fetch = await import('node-fetch');

        const response = await fetch.default(`https://auth.cendrive.com/${req.params[0]}`, {
            method: 'POST',
            body: JSON.stringify(req.body), // Forward the request body
            headers: {
                // Forward all headers from the incoming request
                ...req.headers,
                'Content-Type': 'application/json', // Set content type as needed
            },
            // Include credentials (cookies) with the request
            credentials: 'include',
        });

        res.status(response.status).json(await response.json());
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
