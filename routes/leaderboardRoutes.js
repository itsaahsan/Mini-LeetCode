// routes/leaderboardRoutes.js
const express = require('express');
const router = express.Router();
const { getLeaderboard } = require('../controllers/leaderboardController');

router.route('/').get(getLeaderboard);

module.exports = router;