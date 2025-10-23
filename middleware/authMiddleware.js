// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const db = require('../utils/inMemoryDB');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'minileetcode_secret');

      // Get user from token
      const user = db.findUserById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Remove password from user object
      const { password, ...userWithoutPassword } = user;
      req.user = userWithoutPassword;

      return next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };