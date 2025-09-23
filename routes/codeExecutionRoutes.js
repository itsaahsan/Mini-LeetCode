// routes/codeExecutionRoutes.js
const express = require('express');
const router = express.Router();
const { executeCodeWithTests } = require('../controllers/codeExecutionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/execute').post(protect, executeCodeWithTests);

module.exports = router;