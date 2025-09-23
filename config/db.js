// config/db.js
const db = require('../utils/inMemoryDB');

const connectDB = async () => {
  try {
    console.log('Using in-memory database');
    return db;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;