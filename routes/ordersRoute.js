const express = require('express');
const { upload } = require('../middlewares/multer');
const ordersController = require('../controller/ordersController');


const router = express.Router();

router.get('/orders', ordersController.getProducts);
router.get('/user/orders/:id', ordersController.getUserProducts);
router.post('/orders', ordersController.insertProducts);
router.post('/orders/cod', ordersController.insertOrderCod);
router.put('/order/:id', ordersController.approveOrder);
router.put('/order/received/:id', ordersController.orderReceived)
router.delete('/order/:id', ordersController.deleteOrder);
router.delete('/user/order/:id', ordersController.deleteUserOrder);

module.exports = router;

