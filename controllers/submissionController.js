// controllers/submissionController.js
const db = require('../utils/inMemoryDB');
const { executeCode } = require('../utils/localCodeExecutor');

// Submit code for a problem
const submitCode = async (req, res) => {
  try {
    const { problemId, code, language } = req.body;
    const userId = req.user.id;

    // Verify problem exists
    const problem = db.findProblemById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    // Execute code against test cases
    const result = await executeCode(code, language, problem.testCases);

    // Create submission record
    const submission = {
      id: Date.now().toString(),
      userId,
      problemId,
      code,
      language,
      status: result.passed ? 'Accepted' : 'Failed',
      runtime: result.runtime,
      memory: result.memory || 0,
      testCaseResults: result.testResults,
      submittedAt: new Date()
    };

    // Save submission
    db.createSubmission(submission);

    // Update user statistics if submission is accepted
    if (result.passed) {
      const user = db.findUserById(userId);
      if (user) {
        if (!user.solvedProblems) user.solvedProblems = new Set();
        user.solvedProblems.add(problemId);
        user.totalSubmissions = (user.totalSubmissions || 0) + 1;
        user.successfulSubmissions = (user.successfulSubmissions || 0) + 1;
        db.updateUser(user);
      }
    }

    res.json({
      ...submission,
      testCases: result.testResults
    });
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ message: 'Error processing submission' });
  }
};

// Get user submissions
const getUserSubmissions = async (req, res) => {
  try {
    const userId = req.user.id;
    const submissions = db.getSubmissionsByUserId(userId);
    
    // Sort submissions by date descending
    const sortedSubmissions = submissions.sort((a, b) => 
      new Date(b.submittedAt) - new Date(a.submittedAt)
    );

    // Populate problem titles
    const populatedSubmissions = sortedSubmissions.map(submission => {
      const problem = db.findProblemById(submission.problemId);
      return {
        ...submission,
        problem: { title: problem ? problem.title : 'Unknown Problem' }
      };
    });
    
    res.json(populatedSubmissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get submission by ID
const getSubmissionById = async (req, res) => {
  try {
    const submission = db.findSubmissionById(req.params.id);
    
    if (submission) {
      const user = db.findUserById(submission.userId);
      const problem = db.findProblemById(submission.problemId);
      
      res.json({
        ...submission,
        user: { username: user ? user.username : 'Unknown User' },
        problem: { title: problem ? problem.title : 'Unknown Problem' }
      });
    } else {
      res.status(404).json({ message: 'Submission not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to format submissions
const formatSubmission = (submission, user, problem) => {
  return {
    id: submission.id,
    code: submission.code,
    language: submission.language,
    status: submission.status,
    runtime: submission.runtime,
    memory: submission.memory,
    submittedAt: submission.submittedAt,
    user: user ? { 
      id: user.id,
      username: user.username 
    } : null,
    problem: problem ? {
      id: problem.id,
      title: problem.title
    } : null,
    testCaseResults: submission.testCaseResults
  };
};

module.exports = {
  submitCode,
  getUserSubmissions,
  getSubmissionById
};