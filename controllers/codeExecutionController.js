// controllers/codeExecutionController.js
const { executeCode } = require('../utils/localCodeExecutor');
const db = require('../utils/inMemoryDB');

// Execute code against test cases
const executeCodeWithTests = async (req, res) => {
  try {
    const { problemId, code, language } = req.body;
    
    // Get problem with test cases
    const problem = db.findProblemById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    
    // Execute user code
    const result = await executeCode(code, language, problem.testCases);
    
    // Process test results
    const allTestsPassed = result.passed;
    const testCasesPassed = result.testResults.filter(r => r.passed).length;

    // Update user score if all tests pass
    if (allTestsPassed) {
      const user = db.findUserById(req.user.id);
      if (user) {
        user.score = (user.score || 0) + (problem.points || 1);
        user.problemsSolved = (user.problemsSolved || 0) + 1;
        db.updateUser(user);
      }
    }
    
    // Create submission
    const submission = db.createSubmission({
      userId: req.user.id,
      problemId,
      code,
      language,
      status: allTestsPassed ? 'Accepted' : 'Wrong Answer',
      testCasesPassed,
      totalTestCases: problem.testCases.length,
      testResults: result.testResults,
      runtime: result.runtime || 0,
      memory: result.memory || 0
    });
    
    res.json({
      success: true,
      allTestsPassed,
      testCasesPassed,
      totalTestCases: problem.testCases.length,
      testResults: result.testResults,
      runtime: result.runtime || 0,
      memory: result.memory || 0,
      submissionId: submission.id
    });
  } catch (error) {
    console.error('Code execution error:', error);
    res.status(500).json({ message: 'Error executing code', error: error.message });
  }
};

module.exports = {
  executeCodeWithTests
};