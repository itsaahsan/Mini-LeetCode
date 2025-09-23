// routes/submissionRoutes.js
const express = require('express');
const router = express.Router();
const { submitCode, getUserSubmissions, getSubmissionById } = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, submitCode).get(protect, getUserSubmissions);
router.route('/:id').get(protect, getSubmissionById);

module.exports = router;