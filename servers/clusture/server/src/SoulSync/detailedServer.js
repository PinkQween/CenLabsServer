const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const axios = require('axios');

module.exports = {
    setupRoutes: (app) => {
        // Parse JSON bodies
        app.use(bodyParser.json());

        // In-memory storage for user data (for demonstration purposes only)
        let userData = [];

        // Sinch credentials
        const sinchAppKey = '74e111fb-5f60-4b18-8b4b-c4b5293a9684';
        const sinchAppSecret = 'kknY3a0dcE2E+OhtYHLdrQ==';
        const sinchVerificationUrl = 'https://verification.api.sinch.com/verification/v1/verifications';

        // Function to save user data to the JSON file
        const saveUserDataToFile = () => {
            const filePath = path.join(__dirname, '../../db/other/soulSyncUsers.json');
            const jsonData = JSON.stringify(userData, null, 2);

            fs.writeFileSync(filePath, jsonData, 'utf-8');
        };

        const formatUserForSending = (user) => {
            delete user.hashedPassword
            return user
        }

        // Endpoint for user registration
        app.post('/signup', async (req, res) => {
            const { username, phoneNumber, password, confirmPassword, birthdate } = req.body;

            // console.log(phoneNumber);

            // // Validate password match
            // if (password !== confirmPassword) {
            //     console.log('Passwords do not match')
            //     return res.status(400).json({ error: 'Passwords do not match' });
            // }

            // // Hash the password
            // const hashedPassword = await bcrypt.hash(password, 10);

            // // Save user data (for demonstration purposes only)
            // const newUser = {
            //     username,
            //     birthdate,
            //     phoneNumber,
            //     hashedPassword,
            // };

            // userData.push(newUser);

            // // Send phone confirmation using Sinch
            // const basicAuthentication = `${sinchAppKey}:${sinchAppSecret}`;

            // const payload = {
            //     identity: {
            //         type: 'number',
            //         endpoint: phoneNumber,
            //     },
            //     method: 'sms',
            // };

            // const headers = {
            //     'Authorization': `Basic ${Buffer.from(basicAuthentication).toString('base64')}`,
            //     'Content-Type': 'application/json; charset=utf-8',
            // };

            // try {
            //     // Initiate phone verification
            //     await axios.post(sinchVerificationUrl, payload, { headers });

                // Respond to the client with success
                console.log(birthdate)
                res.json({ success: true });
            // } catch (error) {
            //     console.error(error);
            //     res.status(500).json({ error: 'Failed to send confirmation code' });
            // }
        });

        // Endpoint for verifying the phone number after receiving the code
        app.put('/verify', async (req, res) => {
            // const { phoneNumber, verificationCode } = req.body;

            // console.log(phoneNumber, verificationCode)

            // const basicAuthentication = `${sinchAppKey}:${sinchAppSecret}`;

            // const payload = {
            //     method: 'sms',
            //     sms: {
            //         code: verificationCode,
            //     },
            // };

            // const headers = {
            //     'Authorization': `Basic ${Buffer.from(basicAuthentication).toString('base64')}`,
            //     'Content-Type': 'application/json; charset=utf-8',
            // };

            // try {
            //     // Use axios to make a PUT request to Sinch verification endpoint
            //     const verificationResponse = await axios.put(
            //         `https://verification.api.sinch.com/verification/v1/verifications/number/${phoneNumber}`,
            //         payload,
            //         { headers }
            //     );

            //     // Handle the Sinch verification response
            //     console.log(verificationResponse.data);

            //     // Save the user data to the file after successful verification
            //     saveUserDataToFile();

            // Respond to the client with success
            // res.json({ success: true, user: formatUserForSending(userData.find((user) => user.phoneNumber === phoneNumber)) });
            res.json({ success: true });
            // } catch (error) {
            //     console.error(error);
            //     res.status(500).json({ error: 'Failed to verify the phone number' });
            // }
        });

        app.post('/setup-profile', (req, res) => {

        })
    },
};
