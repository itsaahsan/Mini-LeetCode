import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Container,
  Typography,
  Button,
  Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const difficultyColors = {
  Easy: 'success',
  Medium: 'warning',
  Hard: 'error'
};

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/problems');
        console.log('Problems fetched:', response.data);
        // Add default success rate if not present
        const problemsWithRate = response.data.map(p => ({
          ...p,
          successRate: p.successRate || 0
        }));
        setProblems(problemsWithRate);
        setError(null);
      } catch (error) {
        console.error('Error fetching problems:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const handleProblemClick = (id) => {
    navigate(`/problems/${id}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Coding Problems
        </Typography>
      </Box>
      
      {loading && (
        <Typography variant="h6" sx={{ textAlign: 'center', my: 4 }}>
          Loading problems...
        </Typography>
      )}
      
      {error && (
        <Typography variant="h6" color="error" sx={{ textAlign: 'center', my: 4 }}>
          Error: {error}
        </Typography>
      )}
      
      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width="30%">Title</TableCell>
                <TableCell width="15%">Difficulty</TableCell>
                <TableCell width="20%">Category</TableCell>
                <TableCell width="15%">Success Rate</TableCell>
                <TableCell width="20%">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {problems.map((problem) => (
                <TableRow 
                  key={problem._id}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleProblemClick(problem._id)}
                >
                  <TableCell>{problem.title}</TableCell>
                  <TableCell>
                    <Chip
                      label={problem.difficulty}
                      color={difficultyColors[problem.difficulty]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{problem.category}</TableCell>
                  <TableCell>{`${Math.round(problem.successRate || 0)}%`}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                    >
                      Solve
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {problems.length === 0 && !loading && (
            <Typography variant="body1" sx={{ textAlign: 'center', py: 3 }}>
              No problems available at the moment.
            </Typography>
          )}
        </TableContainer>
      )}
    </Container>
  );
};

export default ProblemList;