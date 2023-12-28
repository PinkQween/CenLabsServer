const path = require('path');
const express = require('express');

module.exports = {
    setupRoutes: (app) => {
        const router = express.Router();

        router.use(express.static(path.join(__dirname, 'clients/www/dist')));

        router.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, 'clients/www/dist/index.html'));
        });

        app.use('/', router)
    }
};