// utils/codeValidator.js
const validateTestCase = (expected, actual) => {
  if (typeof expected !== typeof actual) {
    return false;
  }

  if (Array.isArray(expected)) {
    if (!Array.isArray(actual) || expected.length !== actual.length) {
      return false;
    }
    return expected.every((item, index) => validateTestCase(item, actual[index]));
  }

  if (typeof expected === 'object' && expected !== null) {
    if (typeof actual !== 'object' || actual === null) {
      return false;
    }
    const expectedKeys = Object.keys(expected).sort();
    const actualKeys = Object.keys(actual).sort();
    if (expectedKeys.join(',') !== actualKeys.join(',')) {
      return false;
    }
    return expectedKeys.every(key => validateTestCase(expected[key], actual[key]));
  }

  return expected === actual;
};

const validateSubmission = async (problemId, code, language, testCases) => {
  const results = [];
  let totalTime = 0;
  let maxMemory = 0;

  for (const testCase of testCases) {
    const result = await executeTestCase(code, language, testCase.input);
    
    if (result.error) {
      return {
        status: 'Error',
        message: result.error,
        runtime: null,
        memory: null
      };
    }

    const isCorrect = validateTestCase(testCase.expected, result.output);
    totalTime += result.runtime;
    maxMemory = Math.max(maxMemory, result.memory);

    results.push({
      passed: isCorrect,
      runtime: result.runtime,
      memory: result.memory,
      input: testCase.input,
      expected: testCase.expected,
      actual: result.output
    });

    if (!isCorrect) {
      return {
        status: 'Wrong Answer',
        message: `Failed test case: Input: ${JSON.stringify(testCase.input)}, Expected: ${JSON.stringify(testCase.expected)}, Got: ${JSON.stringify(result.output)}`,
        runtime: totalTime,
        memory: maxMemory
      };
    }
  }

  return {
    status: 'Accepted',
    message: 'All test cases passed!',
    runtime: Math.round(totalTime / testCases.length),
    memory: maxMemory
  };
};

module.exports = {
  validateSubmission
};