// utils/localCodeExecutor.js
const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const os = require('os');

// Create a temporary directory for code execution
const TEMP_DIR = path.join(os.tmpdir(), 'mini-leetcode');

// Ensure temp directory exists
(async () => {
  try {
    await fs.mkdir(TEMP_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating temp directory:', error);
  }
})();

// Language configurations
const languages = {
  javascript: {
    extension: '.js',
    command: 'node',
    setup: async () => {
      // No setup needed for Node.js
      return true;
    }
  },
  python: {
    extension: '.py',
    command: 'python',
    setup: async () => {
      // Check if Python is installed
      return new Promise((resolve) => {
        const python = spawn('python', ['--version']);
        python.on('close', (code) => {
          resolve(code === 0);
        });
      });
    }
  }
};

const executeCode = async (code, language, input = '') => {
  if (!languages[language]) {
    throw new Error('Unsupported language');
  }

  // Create a unique filename
  const filename = crypto.randomBytes(16).toString('hex') + languages[language].extension;
  const filepath = path.join(TEMP_DIR, filename);

  try {
    // Check if language is available
    const isSetup = await languages[language].setup();
    if (!isSetup) {
      throw new Error(`${language} is not properly set up on this system`);
    }

    // Write code to file
    await fs.writeFile(filepath, code);

    // Execute code
    const result = await new Promise((resolve, reject) => {
      const startTime = process.hrtime();
      const process = spawn(languages[language].command, [filepath]);
      let output = '';
      let error = '';

      // Handle input if provided
      if (input) {
        process.stdin.write(input);
        process.stdin.end();
      }

      process.stdout.on('data', (data) => {
        output += data.toString();
      });

      process.stderr.on('data', (data) => {
        error += data.toString();
      });

      process.on('close', (code) => {
        const endTime = process.hrtime(startTime);
        const runtime = endTime[0] * 1000 + endTime[1] / 1000000; // Convert to milliseconds

        resolve({
          success: code === 0,
          output: output.trim(),
          error: error.trim(),
          runtime: Math.round(runtime),
          memory: process.memoryUsage().heapUsed / 1024 / 1024 // Convert to MB
        });
      });

      // Set timeout for execution (5 seconds)
      setTimeout(() => {
        process.kill();
        reject(new Error('Execution timed out'));
      }, 5000);
    });

    return result;
  } catch (error) {
    throw error;
  } finally {
    // Clean up temporary file
    try {
      await fs.unlink(filepath);
    } catch (error) {
      console.error('Error cleaning up temporary file:', error);
    }
  }
};

const validateTestCases = async (code, language, testCases) => {
  const results = [];
  let totalRuntime = 0;
  let maxMemory = 0;

  for (const testCase of testCases) {
    try {
      const result = await executeCode(code, language, testCase.input);
      
      const passed = result.output === testCase.expected.toString();
      totalRuntime += result.runtime;
      maxMemory = Math.max(maxMemory, result.memory);

      results.push({
        passed,
        runtime: result.runtime,
        memory: result.memory,
        output: result.output,
        expected: testCase.expected,
        error: result.error
      });

      if (!passed) {
        return {
          success: false,
          error: `Test case failed. Expected: ${testCase.expected}, Got: ${result.output}`,
          runtime: totalRuntime,
          memory: maxMemory
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        runtime: totalRuntime,
        memory: maxMemory
      };
    }
  }

  return {
    success: true,
    runtime: Math.round(totalRuntime / testCases.length),
    memory: maxMemory,
    results
  };
};

module.exports = {
  executeCode,
  validateTestCases,
  supportedLanguages: Object.keys(languages)
};