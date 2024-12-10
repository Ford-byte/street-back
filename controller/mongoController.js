
const dotenv = require('dotenv');
const axios = require('axios');
const getCurrentDateTime = require('../middlewares/getDate');
const { v4: uuidv4 } = require('uuid');


// Load environment variables from .env file
dotenv.config();
const ordersModel = require('../model/ordersModel');
const productModel = require('../model/productModel');

class Controller {
    async payMent(req, res) {
        const { amount, currency } = req.body;
        const PAYMONGO_API_KEY = process.env.PAYMONGO_SECRET;
        // Ensure the amount is at least 2000 cents
        const amountInCents = Math.max(amount, 2000);

        try {
            const response = await axios.post('https://api.paymongo.com/v1/payment_intents', {
                data: {
                    attributes: {
                        amount: amountInCents,
                        currency,
                        payment_method_allowed: ['gcash'],
                        payment_method_types: ['gcash'],
                    }
                }
            }, {
                headers: {
                    'Authorization': `Basic ${Buffer.from(PAYMONGO_API_KEY + ':').toString('base64')}`,
                    'Content-Type': 'application/json'
                }
            });
            res.json({ clientSecret: response.data.data.attributes.client_secret });

        } catch (error) {
            console.error('Error creating payment intent:', error.response ? error.response.data : error.message);
            res.status(500).send('Error creating payment intent');
        }

    }


    async checkOut(req, res) {
        const { clientSecret, items } = req.body;
        const PAYMONGO_API_KEY = process.env.PAYMONGO_SECRET;
        const lineItems = items.map(item => ({
            amount: parseFloat(item.price, 10) * 100,
            currency: 'PHP',
            name: item.pname,
            quantity: item.quantity,
        }));

        try {
            const response = await axios.post('https://api.paymongo.com/v1/checkout_sessions', {
                data: {
                    attributes: {
                        payment_intent: clientSecret,
                        line_items: lineItems,
                        payment_method_types: ['gcash'],
                        success_url: process.env.CORS_ORIGINS + '/success',
                        cancel_url:  process.env.CORS_ORIGINS + '/',
                    }
                }
            }, {
                headers: {
                    'Authorization': `Basic ${Buffer.from(PAYMONGO_API_KEY + ':').toString('base64')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.data && response.data.data.attributes) {
                const checkoutSessionId = response.data.data.id;
                const paymentIntentId = response.data.data.attributes.payment_intent;

                try {
                    let result;
                    items.forEach(element => {
                        result = ordersModel.insertOrder([
                            uuidv4(),
                            element.uid,
                            element.pid,
                            checkoutSessionId,
                            paymentIntentId.id,
                            element.uname,
                            element.pname,
                            element.price,
                            element.size,
                            element.quantity,
                            element.location,
                        ]);
                        productModel.buyProduct(element.size, element.quantity, element.psid);
                    });
                    return res.status(200).json({ message: 'Product inserted successfully!', checkoutUrl: response.data.data.attributes.checkout_url });
                } catch (error) {
                    console.error('Error inserting products:', error);
                    res.status(500).json({ message: 'Internal Server Error!' });
                }

            } else {
                console.error('Checkout URL is undefined.');
                res.status(500).send('Error creating checkout session');
            }
        } catch (error) {
            console.error('Error creating checkout session:', error.response ? error.response.data : error.message);
            res.status(500).send('Error creating checkout session');
        }
    }
}

module.exports = new Controller();
