const express = require('express');
const feedbackController = require('../controller/feedbackController');

const router = express.Router();

router.get('/feedbacks/:id', feedbackController.getFeedbacks);
router.post('/feedback',feedbackController.insertFeedback);
router.get('/feedbacks',feedbackController.getAllFeedbacks);
router.delete('/feedback/:id',feedbackController.dropFeedback);

module.exports = router;