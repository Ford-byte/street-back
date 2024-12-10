const express = require('express');
const cartController = require('../controller/cartController');

const router = express.Router();

router.get('/cart', cartController.getCart);
router.post('/cart',cartController.insertCart);

module.exports = router;