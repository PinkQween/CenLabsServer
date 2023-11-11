const express = require('express');
const app = require('../index');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const init = require('./passport');
const passport = require('passport');
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const users = [];

// Replace 'your-secret-key' with strong secret keys
const JWT_SECRET = '1035a874d52923e06ab52135f8052182d1471d851b843793aac145143b591e85';

init(passport, email => {
    return users.find(user => user.email === email);
}, id => {
    return users.find(user => user.id === id);
});

app.post('/register', async (req, res) => {
    try {
        const { name, email, password, verifyPassword } = req.body;

        if (users.some(user => user.email === email)) {
            return res.status(400).json({ success: false, error: 'Email already in use' });
        }

        if (password !== verifyPassword) {
            return res.status(400).json({ success: false, error: "Passwords don't match" });
        }

        if (!password) {
            console.log('No password provided');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: uuidv4(),
            dateOfCreation: Date.now().toString(),
            name,
            email,
            multilayerHashedPassword: hashedPassword,
        };

        const token = jwt.sign(newUser, JWT_SECRET);

        newUser.token = token;

        users.push(newUser);

        res.status(201).json({ success: true, token, user: newUser });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/login', async (req, res) => {
    passport.authenticate('local', async (err, user) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }

        if (!user) {
            return res.status(401).json({ success: false, message: 'Authentication failed' });
        }

        res.json({ success: true, user });
    })(req, res);
});

app.get('/user-data', (req, res) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Token not provided' });
    }

    console.log(token)

    const user = users.find(user => `Bearer ${user.token}` === token);

    if (user) {
        res.json({ success: true, user });
    } else {
        res.status(401).json({ success: false, message: 'User not found' });
    }
});

app.post('/update-account', async (req, res) => {
    const token = req.headers['authorization'];

    if(!token) {
        return res.status(401).json({ success: false, message: 'Token not provided' });
    }

    console.log(token)

    const user = users.find(user => `Bearer ${user.token}` === token);

    if (user) {
        const { name, email, password, verifyPassword } = req.body;

        let hashedPassword = await bcrypt.hash(password, 10);

        if (hashedPassword != user.multilayerHashedPassword) {
            if (password !== verifyPassword) {
                return res.status(400).json({ success: false, error: "Passwords don't match" });
            }
        }

        if (email !== user.email) {
            if (users.some(user => user.email === email)) {
                return res.status(400).json({ success: false, error: 'Email already in use' });
            }
        }

        user.multilayerHashedPassword = hashedPassword;
        user.email = email;
        user.name = name;
        
        res.status(201).json({ success: true, user })
    } else {
        res.status(401).json({ success: false, message: 'User not found' });
    }
})