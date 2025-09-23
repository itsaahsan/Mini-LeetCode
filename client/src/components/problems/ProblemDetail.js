import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Divider,
  Grid
} from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CodeEditor from './CodeEditor';

const ProblemDetail = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);

  const fetchProblem = useCallback(async () => {
    try {
      const response = await axios.get(`/api/problems/${id}`);
      setProblem(response.data);
    } catch (error) {
      console.error('Error fetching problem:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchProblem();
  }, [id, fetchProblem]);

  const [code, setCode] = useState('');

  const handleCodeChange = (value) => {
    setCode(value);
  };

  if (!problem) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h4" component="h1">
                {problem.title}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Chip
                  label={problem.difficulty}
                  color={
                    {
                      Easy: 'success',
                      Medium: 'warning',
                      Hard: 'error'
                    }[problem.difficulty]
                  }
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Chip label={problem.category} size="small" />
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {problem.description}
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6">Example:</Typography>
              <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
                <Typography variant="body2" component="pre">
                  {problem.example}
                </Typography>
              </Paper>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6">Solution:</Typography>
            </Box>
            <CodeEditor
              problemId={id}
              onSubmissionComplete={() => {
                // Refresh problem data after successful submission
                fetchProblem();
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProblemDetail;