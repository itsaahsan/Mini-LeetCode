// controllers/codeExecutionController.js
const { executeCode } = require('../utils/localCodeExecutor');
const db = require('../utils/inMemoryDB');

// Execute code against test cases
const executeCodeWithTests = async (req, res) => {
  try {
    const { problemId, code, language } = req.body;
    
    if (!problemId || !code || !language) {
      return res.status(400).json({ message: 'Please provide problemId, code, and language' });
    }

    // Get problem with test cases
    const problem = db.findProblemById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    
    // Execute user code against test cases
    const result = await executeCode(code, language, problem.testCases);
    
    if (result.error) {
      return res.status(400).json({
        success: false,
        error: result.error,
        output: result.output,
        runtime: result.runtime || 0
      });
    }

    // Create submission
    const submission = db.createSubmission({
      userId: req.user.id,
      problemId,
      code,
      language,
      status: result.success ? 'Accepted' : 'Wrong Answer',
      runtime: result.runtime || 0,
      memory: result.memory || 0
    });
    
    res.json({
      success: true,
      status: result.success ? 'Accepted' : 'Wrong Answer',
      output: result.output,
      error: result.error,
      runtime: result.runtime || 0,
      memory: result.memory || 0,
      submissionId: submission._id
    });
  } catch (error) {
    console.error('Code execution error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error executing code', 
      error: error.message 
    });
  }
};

module.exports = {
  executeCodeWithTests
};