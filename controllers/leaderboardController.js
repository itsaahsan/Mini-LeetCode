// controllers/leaderboardController.js
const db = require('../utils/inMemoryDB');

// Get leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = db.getLeaderboard();
    
    const formattedLeaderboard = leaderboard
      .map(user => ({
        _id: user._id,
        username: user.username,
        score: user.points || 0,
        problemsSolved: user.solvedProblems ? user.solvedProblems.length : 0,
        totalSubmissions: user.totalSubmissions || 0,
        successfulSubmissions: user.successfulSubmissions || 0
      }))
      .slice(0, 50); // Top 50 users
    
    res.json(formattedLeaderboard);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getLeaderboard
};