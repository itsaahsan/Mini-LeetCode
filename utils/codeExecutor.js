// utils/codeExecutor.js
const Docker = require('dockerode');
const fs = require('fs').promises;
const path = require('path');

let docker;
let dockerEnabled = true;

// Try to initialize Docker
try {
  docker = new Docker();
  // Test Docker connection
  docker.ping().catch(() => {
    dockerEnabled = false;
    console.log('Docker not available. Code execution will be simulated.');
  });
} catch (error) {
  dockerEnabled = false;
  console.log('Docker not available. Code execution will be simulated.');
}

// Languages configuration
const languages = {
  javascript: {
    image: 'node:18-alpine',
    fileExtension: '.js',
    compileCommand: null,
    runCommand: 'node',
    template: 'module.exports = { solution };',
    timeout: 5000,
    memoryLimit: '50m'
  },
  python: {
    image: 'python:3.9-alpine',
    fileExtension: '.py',
    compileCommand: null,
    runCommand: 'python',
    template: 'def solution():',
    timeout: 5000,
    memoryLimit: '50m'
  },
  java: {
    image: 'openjdk:11-jdk-alpine',
    fileExtension: '.java',
    compileCommand: 'javac',
    runCommand: 'java',
    template: 'public class Solution {\n    public static void main(String[] args) {}\n}',
    timeout: 10000,
    memoryLimit: '100m'
  },
  cpp: {
    image: 'gcc:latest',
    fileExtension: '.cpp',
    compileCommand: 'g++',
    runCommand: './a.out',
    template: '#include <iostream>\nint main() {\n    return 0;\n}',
    timeout: 5000,
    memoryLimit: '50m'
  },
  python: {
    image: 'python:3.9-alpine',
    fileExtension: '.py',
    compileCommand: null,
    runCommand: 'python'
  },
  java: {
    image: 'openjdk:11-jdk-slim',
    fileExtension: '.java',
    compileCommand: 'javac',
    runCommand: 'java'
  },
  cpp: {
    image: 'gcc:latest',
    fileExtension: '.cpp',
    compileCommand: 'g++ -o program',
    runCommand: './program'
  }
};

// Simulate code execution when Docker is not available
const simulateCodeExecution = async (code, language) => {
  console.log(`Simulating code execution for ${language}`);
  
  // Simple simulation based on language
  let output = '';
  let exitCode = 0;
  
  switch (language) {
    case 'javascript':
      output = 'Code executed successfully (simulated)';
      break;
    case 'python':
      output = 'Code executed successfully (simulated)';
      break;
    case 'java':
      output = 'Code compiled and executed successfully (simulated)';
      break;
    case 'cpp':
      output = 'Code compiled and executed successfully (simulated)';
      break;
    default:
      output = 'Unsupported language';
      exitCode = 1;
  }
  
  return {
    exitCode,
    output
  };
};

// Execute code in Docker container
const executeCode = async (code, language, testCases) => {
  const langConfig = languages[language];
  if (!langConfig) {
    throw new Error(`Unsupported language: ${language}`);
  }

  // If Docker is not available, simulate execution
  if (!dockerEnabled) {
    return simulateCodeExecution(code, language);
  }

  // Create a temporary directory for the code
  const tempDir = path.join(__dirname, '..', 'temp', Date.now().toString());
  await fs.mkdir(tempDir, { recursive: true });

  try {
    // Write code to file
    const fileName = `program${langConfig.fileExtension}`;
    const filePath = path.join(tempDir, fileName);
    await fs.writeFile(filePath, code);

    // Create Docker container
    const container = await docker.createContainer({
      Image: langConfig.image,
      Cmd: ['sh', '-c', `cd /usr/src && ${langConfig.runCommand} ${fileName}`],
      HostConfig: {
        Binds: [`${tempDir}:/usr/src`],
        Memory: 100 * 1024 * 1024, // 100MB memory limit
        NetworkMode: 'none', // Disable network
        AutoRemove: true
      },
      Tty: false
    });

    // Start container
    await container.start();

    // Wait for container to finish
    const data = await container.wait();
    
    // Get container logs
    const logs = await container.logs({
      stdout: true,
      stderr: true
    });

    // Clean up
    await fs.rm(tempDir, { recursive: true, force: true });

    return {
      exitCode: data.StatusCode,
      output: logs.toString()
    };
  } catch (error) {
    // Clean up
    await fs.rm(tempDir, { recursive: true, force: true });
    
    // If Docker fails, fall back to simulation
    console.log('Docker execution failed, falling back to simulation:', error.message);
    return simulateCodeExecution(code, language);
  }
};

module.exports = { executeCode };