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

const executeCode = async (code, language, testCases = []) => {
  if (!languages[language]) {
    return {
      success: false,
      error: 'Unsupported language: ' + language
    };
  }

  if (!testCases || testCases.length === 0) {
    return {
      success: false,
      error: 'No test cases provided'
    };
  }

  // Create a unique filename
  const filename = crypto.randomBytes(16).toString('hex') + languages[language].extension;
  const filepath = path.join(TEMP_DIR, filename);

  try {
    // Check if language is available
    const isSetup = await languages[language].setup();
    if (!isSetup) {
      return {
        success: false,
        error: `${language} is not installed on this system`
      };
    }

    // Write code to file
    await fs.writeFile(filepath, code);

    // Run test cases
    let allPassed = true;
    let totalRuntime = 0;
    let maxMemory = 0;

    for (const testCase of testCases) {
      try {
        const result = await new Promise((resolve, reject) => {
          const startTime = process.hrtime();
          const proc = spawn(languages[language].command, [filepath]);
          let output = '';
          let error = '';

          // Handle input
          if (testCase.input) {
            proc.stdin.write(testCase.input.toString());
            proc.stdin.end();
          }

          proc.stdout.on('data', (data) => {
            output += data.toString();
          });

          proc.stderr.on('data', (data) => {
            error += data.toString();
          });

          proc.on('close', (code) => {
            const endTime = process.hrtime(startTime);
            const runtime = endTime[0] * 1000 + endTime[1] / 1000000;

            resolve({
              success: code === 0,
              output: output.trim(),
              error: error.trim(),
              runtime: Math.round(runtime),
              memory: 0
            });
          });

          // Set timeout
          setTimeout(() => {
            proc.kill();
            reject(new Error('Execution timed out'));
          }, 5000);
        });

        totalRuntime += result.runtime;
        
        // Check if output matches expected
        const passed = result.output === testCase.expected.toString();
        if (!passed) {
          allPassed = false;
          break;
        }
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    }

    return {
      success: allPassed,
      output: allPassed ? 'All tests passed' : 'Test failed',
      error: allPassed ? '' : 'Output mismatch',
      runtime: totalRuntime,
      memory: maxMemory,
      testResults: []
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  } finally {
    // Clean up
    try {
      await fs.unlink(filepath);
    } catch (e) {
      console.error('Cleanup error:', e);
    }
  }
};



module.exports = {
  executeCode,
  supportedLanguages: Object.keys(languages)
};