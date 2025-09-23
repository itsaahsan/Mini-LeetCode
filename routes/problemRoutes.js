// routes/problemRoutes.js
const express = require('express');
const router = express.Router();
const { getProblems, getProblemById, createProblem } = require('../controllers/problemController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getProblems).post(protect, createProblem);
router.route('/:id').get(getProblemById);

module.exports = router;