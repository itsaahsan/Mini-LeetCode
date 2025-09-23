import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Tabs,
  Tab,
  Avatar,
  Chip
} from '@mui/material';
import axios from 'axios';

const LeaderboardTabs = {
  GLOBAL: 0,
  MONTHLY: 1,
  WEEKLY: 2
};

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState(LeaderboardTabs.GLOBAL);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const period = ['global', 'monthly', 'weekly'][activeTab];
        const response = await axios.get(`/api/leaderboard/${period}`);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [activeTab]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const calculateSuccessRate = (total, successful) => {
    if (total === 0) return 0;
    return Math.round((successful / total) * 100);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Leaderboard
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Global" />
          <Tab label="Monthly" />
          <Tab label="Weekly" />
        </Tabs>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>User</TableCell>
              <TableCell align="right">Problems Solved</TableCell>
              <TableCell align="right">Success Rate</TableCell>
              <TableCell align="right">Points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow
                key={user._id}
                sx={index < 3 ? { backgroundColor: 'action.hover' } : {}}
              >
                <TableCell>
                  {index + 1}
                  {index < 3 && (
                    <Chip
                      size="small"
                      label={['🥇', '🥈', '🥉'][index]}
                      sx={{ ml: 1 }}
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar>{user.username[0].toUpperCase()}</Avatar>
                    {user.username}
                  </Box>
                </TableCell>
                <TableCell align="right">{user.solvedProblems.length}</TableCell>
                <TableCell align="right">
                  {calculateSuccessRate(user.totalSubmissions, user.successfulSubmissions)}%
                </TableCell>
                <TableCell align="right">{user.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Leaderboard;