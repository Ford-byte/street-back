const express = require('express');
const imageController = require('../controller/imageController');
const { upload } = require('../middlewares/multer');

const router = express.Router();

// Handle errors in file upload middleware
router.post('/images', (req, res, next) => {
    upload.single('images')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: 'File upload failed', details: err.message });
        }
        next();
    });
}, imageController.insertImage);

router.get('/images/:id', imageController.getImages);
router.get('/allimages', imageController.getAllImages);

module.exports = router;
