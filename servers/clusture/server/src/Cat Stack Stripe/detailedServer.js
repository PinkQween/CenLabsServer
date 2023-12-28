const app = require('../index')
const cors = require('cors');
const stripe = require('stripe')('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');

module.exports = {
    setupRoutes: (app) => {
        app.use(cors())

        app.post('/create-payment-intent-500000-kit-coins', async (req, res) => {
            try {
                const paymentIntent = await stripe.paymentIntents.create({
                    amount: 5000, // Replace with the amount in cents
                    currency: 'usd',
                });

                res.json({ clientSecret: paymentIntent.client_secret });
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Payment failed' });
            }
        });

        app.get('/', (req, res) => {
            res.send("Test")
        })
    }
}