const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const axios = require('axios');
const twilio = require('twilio')
const { Vonage } = require('@vonage/server-sdk')
const jwt = require('jsonwebtoken');

require('dotenv').config();

const vonage = new Vonage({
    apiKey: process.env.VONAGE_API_KEY,
    apiSecret: process.env.VONAGE_API_SECRET
})

module.exports = {
    setupRoutes: (app) => {
        // Parse JSON bodies
        app.use(bodyParser.json());

        const auth = (req, res, next) => {
            console.log(req.header('Authorization'))
            // Get token from header
            const token = req.header('Authorization').split(' ')[1];
            // const token = req.header('Authorization');

            // Check if token doesn't exist
            if (!token) {
                console.log("No token")
                return res.status(401).json({ msg: 'No token, authorization denied' });
            }

            try {
                // Verify token
                const decoded = jwt.verify(token, process.env.JWT_SECRET);

                // Set user in request object
                req.user = decoded;

                next();
            } catch (err) {
                console.log("invalid token")
                res.status(401).json({ msg: 'Token is not valid' });
            }
        };

        // In-memory storage for user data (for demonstration purposes only)
        let userData = [];

        try {
            const fileData = fs.readFileSync(path.join(__dirname, '../../db/other/DEVONLY/soulSyncUsers.json'), 'utf-8');
            userData = JSON.parse(fileData);
            console.log(userData)
        } catch (error) {
            console.error('Error reading initial user data file:', error);
        }

        // Sinch credentials
        const sinchAppKey = '74e111fb-5f60-4b18-8b4b-c4b5293a9684';
        const sinchAppSecret = 'kknY3a0dcE2E+OhtYHLdrQ==';
        const sinchVerificationUrl = 'https://sms.api.sinch.com/xms/v1/8e3fafa3eacf440fa3eb5d19cbd9e5f7/batches';

        // Function to save user data to the JSON file
        const saveUserDataToFile = () => {
            const filePath = path.join(__dirname, '../../db/other/soulSyncUsers.json');
            const jsonData = JSON.stringify(userData, null, 2);

            console.log(userData)

            fs.writeFileSync(filePath, jsonData, 'utf-8');
        };

        const formatUserForSending = (user) => {
            delete user.hashedPassword
            return user
        }

        const findUserByPhoneNumber = (phoneNumber) => {
            console.log(userData)
            console.log(phoneNumber)
            return userData.find((user) => user.phoneNumber === phoneNumber);
        };


        const findUserFromToken = (decodedToken) => {
            return userData.find((user) => user.phoneNumber === decodedToken.phoneNumber);
        };

        const smsClient = new twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)

        // Endpoint for user registration
        app.post('/signup', async (req, res) => {
            const { username, phoneNumber, password, confirmPassword, birthdate } = req.body;

            // console.log(phoneNumber);

            if (userData.some(user => user.phoneNumber === phoneNumber)) {
                return res.status(400).json({ error: 'phone_exists' });
            }

            // Validate password match
            if (password !== confirmPassword) {
                console.log('Passwords do not match')
                return res.status(400).json({ error: 'Passwords do not match' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            const code = Math.floor(100000 + Math.random() * 900000);

            // Save user data (for demonstration purposes only)
            const newUser = {
                username,
                birthdate,
                phoneNumber,
                hashedPassword,
                code,
                verified: false
            };

            newUser.token = jwt.sign({ newUser }, process.env.JWT_SECRET);

            userData.push(newUser);

            // // Send phone confirmation using Sinch
            // const basicAuthentication = `${sinchAppKey}:${sinchAppSecret}`;

            // const smsPayload = {
            //     from: '12085796926',
            //     to: [phoneNumber],
            //     body: `This is SoulSync! Here is your one-time verification code ${code}`,
            // };

            // // const headers = {
            // //     'Authorization': `Basic ${Buffer.from(basicAuthentication).toString('base64')}`,
            // //     'Content-Type': 'application/json; charset=utf-8',
            // // };

            // const headers = {
            //     'Authorization': `bearer 8549a5e4de394bfc9681e08e6dafa97d`,
            //     'Content-Type': 'application/json; charset=utf-8',
            // };

            try {
                // Initiate phone verification
                // await axios.post(sinchVerificationUrl, smsPayload, { headers });

                // smsClient.messages
                //     .create({
                //         body: `This is SoulSync! Here is your one- time verification code ${code}`,
                //         from: '+17474773129',
                //         to: phoneNumber
                //     })
                //     .then(message => console.log(`Message SID: ${message.sid}`))
                //     .catch(error => console.error(`Error: ${error.message}`));

                await vonage.sms.send({ to: phoneNumber, from: "17472440284", text: `This is SoulSync! Here is your one time verification code: ${code} ` })
                    .then(resp => { console.log('Message sent successfully'); console.log(resp); })
                    .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });

                // Respond to the client with success
                res.json({ success: true, token: newUser.token });
            } catch (error) {
                console.error('error sending request' + error);
                res.status(500).json({ error: 'Failed to send confirmation code' });
            }
        });

        // Endpoint for verifying the phone number after receiving the code
        app.put('/verify', auth, async (req, res) => {
            const { verificationCode } = req.body;

            console.log(req.user.newUser.phoneNumber)

            // Find the user by phone number
            const user = findUserByPhoneNumber(req.user.newUser.phoneNumber)

            if (!user) {
                return res.status(400).json({ error: 'user_not_found' });
            }

            console.log(user.code)
            console.log(verificationCode)
            console.log(user.code == verificationCode)

            // Check if the verification code matches
            if (user.code != verificationCode) {
                return res.status(400).json({ error: 'wrong_code' });
            }

            // Update user status or perform any other actions as needed
            user.verified = true;

            // Save user data
            saveUserDataToFile();

            // Respond to the client with success
            res.json({ success: true });
        });

        app.post('/prefs', auth, (req, res) => {
            const { gender, sex, interests, sexuality, relationshipStatus, ageRange } = req.body;

            // Find the user by phone number
            const user = findUserByPhoneNumber(req.user.newUser.phoneNumber)

            if (!user) {
                return res.status(400).json({ error: 'user_not_found' });
            }

            // Update the user's preferences
            user.preferences = {
                gender,
                sex,
                interests,
                sexuality,
                relationshipStatus,
                ageRange,
            };

            // Save user data
            saveUserDataToFile();

            // Respond to the client with success
            res.json({ success: true });
        });

        // Endpoint for adding details
        app.post('/details', auth, (req, res) => {
            const { gender, sex, interests, sexuality, relationshipStatus } = req.body;

            console.log(req.user.newUser)

            // Find the user by phone number
            const user = findUserByPhoneNumber(req.user.newUser.phoneNumber)

            if (!user) {
                return res.status(400).json({ error: 'user_not_found' });
            }

            // Update the user's details
            user.details = {
                gender,
                sex,
                interests,
                sexuality,
                relationshipStatus,
            };

            // Save user data
            saveUserDataToFile();

            // Respond to the client with success
            res.json({ success: true });
        });













































        function calculateMatchScore(currentUser, otherUser) {
            let score = 0;

            // Compare preferences and details, increase score for each match
            for (const key in currentUser.preferences) {
                if (
                    currentUser.preferences[key].some(value => otherUser.preferences[key].includes(value)) &&
                    otherUser.details[key].some(value => currentUser.preferences[key].includes(value))
                ) {
                    score++;
                }

                if (
                    otherUser.preferences[key].some(value => currentUser.preferences[key].includes(value)) &&
                    currentUser.details[key].some(value => otherUser.preferences[key].includes(value))
                ) {
                    score++;
                }
            }

            // Check if there's a like or premium like, increase score accordingly
            if (currentUser.likes.includes(otherUser.phoneNumber)) {
                score += 2; // Increase score for a regular like
            } else if (currentUser.premiumLikes.includes(otherUser.phoneNumber)) {
                score += 3; // Increase score even more for a premium like
            }

            // Consider age range, adjust score based on the age difference
            const currentUserBirthdate = new Date(currentUser.birthdate);
            const otherUserBirthdate = new Date(otherUser.birthdate);
            const ageDifference = Math.abs(currentUserBirthdate.getFullYear() - otherUserBirthdate.getFullYear());

            const allowedAgeRange = parseInt(currentUser.preferences.ageRange[0]); // Assuming ageRange is in the format "±X"

            if (ageDifference <= allowedAgeRange) {
                score++; // Increase score if the age difference is within the allowed range
            }

            return score;
        }

        function findMatches(currentUser, allUsers, page = 1, pageSize = 10) {
            const startIdx = (page - 1) * pageSize;
            const endIdx = startIdx + pageSize;
            const subsetUsers = allUsers.slice(startIdx, endIdx);

            // Rest of the function remains the same...
            const matchScores = subsetUsers.map(user => ({
                user,
                score: calculateMatchScore(currentUser, user)
            }));

            // Filter out users that the current user has already seen or liked
            const filteredMatches = matchScores.filter(match => {
                const likedUsers = currentUser.likes.concat(currentUser.premiumLikes);
                return !likedUsers.includes(match.user.username);
            });

            return filteredMatches;
        }

        // Modify the /api/matches endpoint to accept likes and premiumLikes parameters
        app.get('/matches', auth, (req, res) => {
            const { page, pageSize } = req.query;
            const parsedPage = parseInt(page) || 1;
            const parsedPageSize = parseInt(pageSize) || 10;

            const currentUser = findUserByPhoneNumber(req.user.newUser.phoneNumber)

            const potentialMatches = findMatches(currentUser, userData, parsedPage, parsedPageSize);

            res.json(potentialMatches);
        });
    },
};
