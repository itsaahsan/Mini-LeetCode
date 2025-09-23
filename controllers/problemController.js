// controllers/problemController.js
const db = require('../utils/inMemoryDB');

// Get all problems
const getProblems = async (req, res) => {
  try {
    const problems = db.getAllProblems();
    console.log('Retrieved problems:', problems); // Debug log
    const problemsWithoutTestCases = problems.map(p => {
      const { testCases, ...rest } = p;
      return {
        ...rest,
        successRate: 0, // Add default success rate
        submissionCount: 0 // Add submission count
      };
    });
    console.log('Sending problems:', problemsWithoutTestCases); // Debug log
    res.json(problemsWithoutTestCases);
  } catch (error) {
    console.error('Error in getProblems:', error); // Debug log
    res.status(500).json({ message: error.message });
  }
};

// Get problem by ID
const getProblemById = async (req, res) => {
  try {
    const problem = db.findProblemById(req.params.id);
    
    if (problem) {
      res.json(problem);
    } else {
      res.status(404).json({ message: 'Problem not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new problem
const createProblem = async (req, res) => {
  try {
    const { title, description, difficulty, points, testCases, constraints, examples, tags } = req.body;

    if (!title || !description || !difficulty || !testCases) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const problem = {
      title,
      description,
      difficulty,
      points: points || 0,
      testCases,
      constraints: constraints || [],
      examples: examples || [],
      tags: tags || []
    };

    const createdProblem = db.createProblem(problem);
    res.status(201).json(createdProblem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProblems,
  getProblemById,
  createProblem
};