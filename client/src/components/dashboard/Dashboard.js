import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Avatar
} from '@mui/material';
import {
  Assessment,
  CheckCircle,
  Code,
  Timeline
} from '@mui/icons-material';
import axios from 'axios';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userResponse, submissionsResponse] = await Promise.all([
          axios.get('/api/users/profile'),
          axios.get('/api/submissions/recent')
        ]);

        setUserData(userResponse.data);
        setRecentSubmissions(submissionsResponse.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading || !userData) {
    return (
      <Container>
        <LinearProgress />
      </Container>
    );
  }

  const calculateSuccessRate = () => {
    if (userData.totalSubmissions === 0) return 0;
    return Math.round(
      (userData.successfulSubmissions / userData.totalSubmissions) * 100
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* User Info */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 64, height: 64 }}>
              {userData.username[0].toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h4">{userData.username}</Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Joined {new Date(userData.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Stats Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle color="success" />
                <Typography variant="h6">Problems Solved</Typography>
              </Box>
              <Typography variant="h3" sx={{ mt: 2 }}>
                {userData.solvedProblems.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Assessment color="primary" />
                <Typography variant="h6">Success Rate</Typography>
              </Box>
              <Typography variant="h3" sx={{ mt: 2 }}>
                {calculateSuccessRate()}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Code color="secondary" />
                <Typography variant="h6">Total Submissions</Typography>
              </Box>
              <Typography variant="h3" sx={{ mt: 2 }}>
                {userData.totalSubmissions}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Timeline color="warning" />
                <Typography variant="h6">Ranking</Typography>
              </Box>
              <Typography variant="h3" sx={{ mt: 2 }}>
                #{userData.ranking || 'N/A'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Submissions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Submissions
            </Typography>
            <Divider sx={{ my: 2 }} />
            <List>
              {recentSubmissions.map((submission) => (
                <ListItem key={submission._id}>
                  <ListItemText
                    primary={submission.problem.title}
                    secondary={new Date(submission.createdAt).toLocaleString()}
                  />
                  <Chip
                    label={submission.status}
                    color={submission.status === 'Accepted' ? 'success' : 'error'}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;