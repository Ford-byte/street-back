const express = require('express');
const reportController = require('../controller/reportController');
const { handleMultipleFileUpload, upload } = require('../middlewares/multer');
const router = express.Router();

router.get('/reports',reportController.getData)
router.delete('/report/:id',reportController.deleteData)
// router.post('/report',handleMultipleFileUpload,reportController.insertData)
router.post('/report', upload.array('images'), (req, res, next) => {
    if (req.fileValidationError) {
        return res.status(400).json({ error: 'File upload failed', details: req.fileValidationError });
    }
    next();
}, reportController.insertData);


module.exports = router;
