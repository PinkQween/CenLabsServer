const fileUpload = require('express-fileupload');
const path = require('path');
const app = require('../index');
const cors = require('cors');
const express = require('express');

app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static(path.join(__dirname, 'clients/www/dist')));
// app.use(express.static(path.join(__dirname, '../tests/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'clients/www/dist/index.html'))
})