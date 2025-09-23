// controllers/leaderboardController.js
const db = require('../utils/inMemoryDB');

// Get leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const users = Array.from(db.users.values())
      .map(user => ({
        username: user.username,
        score: user.successfulSubmissions || 0,
        problemsSolved: user.solvedProblems ? user.solvedProblems.length : 0
      }))
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return b.problemsSolved - a.problemsSolved;
      })
      .slice(0, 50); // Top 50 users
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getLeaderboard
};