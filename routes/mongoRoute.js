const express = require('express');
const mongoController = require('../controller/mongoController')
const router = express.Router();

router.post('/api/create-payment-intent',mongoController.payMent);
router.post('/api/paymongo-checkout',mongoController.checkOut);

module.exports = router;
