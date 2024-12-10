const express = require('express');
const productController = require('../controller/productController');
const { upload } = require('../middlewares/multer');

const router = express.Router();

router.get('/products', productController.getProducts);

// router.post('/product', upload.array('images'), (req, res, next) => {
//     if (req.fileValidationError) {
//         return res.status(400).json({ error: 'File upload failed', details: req.fileValidationError });
//     }
//     next();
// }, productController.insertProduct);

router.post(
    '/product',
    upload.array('images'),
    (req, res, next) => {
        if (req.fileValidationError) {
            return res.status(400).json({
                error: 'File upload failed',
                details: req.fileValidationError,
            });
        }
        next();
    },
    productController.insertProduct
);
router.get('/products/search', productController.getProductsbyCategory);
router.get('/products/size/:size/category/:category', productController.getProductsbySizeAndCategory);
router.post('/buy/product', productController.buyProduct);
router.put('/cancel/order', productController.cancelProduct);
router.delete('/product/:id', productController.deleteProduct);
router.delete('/allproduct/:id', productController.deleteAllProduct);
router.put('/product/approve/:id', productController.approveProduct);
router.put('/product/disapprove/:id', productController.disapproveProduct);
router.put('/product/:id', productController.updateProduct);
// router.post('/product/stockin',productController.productIn)

module.exports = router;