import React, { useState } from 'react';
import { Box, Paper, Select, MenuItem, Button, Typography } from '@mui/material';
import { Editor } from '@monaco-editor/react';
import axios from 'axios';

const languageOptions = {
  javascript: { name: 'JavaScript', extension: 'js' },
  python: { name: 'Python', extension: 'py' },
  java: { name: 'Java', extension: 'java' },
  cpp: { name: 'C++', extension: 'cpp' }
};

const CodeEditor = ({ problemId, onSubmissionComplete }) => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleCodeChange = (value) => {
    setCode(value);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setResult(null);

    try {
      const response = await axios.post('/api/submissions/submit', {
        problemId,
        language,
        code
      });

      setResult(response.data);
      if (response.data.status === 'Accepted' && onSubmissionComplete) {
        onSubmissionComplete();
      }
    } catch (error) {
      setResult({
        status: 'Error',
        message: error.response?.data?.message || 'Submission failed'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Select
          value={language}
          onChange={handleLanguageChange}
          size="small"
          sx={{ minWidth: 120 }}
        >
          {Object.entries(languageOptions).map(([key, value]) => (
            <MenuItem key={key} value={key}>
              {value.name}
            </MenuItem>
          ))}
        </Select>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Solution'}
        </Button>
      </Box>

      <Paper sx={{ mb: 2 }}>
        <Editor
          height="60vh"
          language={language}
          value={code}
          onChange={handleCodeChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: false
          }}
        />
      </Paper>

      {result && (
        <Paper sx={{ p: 2, bgcolor: result.status === 'Accepted' ? 'success.light' : 'error.light' }}>
          <Typography variant="h6">{result.status}</Typography>
          {result.message && (
            <Typography variant="body2">{result.message}</Typography>
          )}
          {result.runtime && (
            <Typography variant="body2">Runtime: {result.runtime}ms</Typography>
          )}
          {result.memory && (
            <Typography variant="body2">Memory: {result.memory}KB</Typography>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default CodeEditor;