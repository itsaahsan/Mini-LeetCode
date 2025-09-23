import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import './utils/axios';  // Import configured axios
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ProblemList from './components/problems/ProblemList';
import ProblemDetail from './components/problems/ProblemDetail';
import Navigation from './components/Navigation';
import Leaderboard from './components/leaderboard/Leaderboard';
import Dashboard from './components/dashboard/Dashboard';
import { CustomThemeProvider } from './contexts/ThemeContext';
import './App.css';

function App() {
  return (
    <CustomThemeProvider>
      <CssBaseline />
      <Router>
        <div className="App">
          <Navigation />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/problems" replace />} />
            <Route path="/problems" element={
              <ProtectedRoute>
                <ProblemList />
              </ProtectedRoute>
            } />
            <Route path="/problems/:id" element={
              <ProtectedRoute>
                <ProblemDetail />
              </ProtectedRoute>
            } />
            <Route path="/leaderboard" element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </CustomThemeProvider>
  );
}

export default App;
