import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, TextField, Typography, Paper, Alert } from '@mui/material';
import { Container, Form } from 'react-bootstrap';
import { useTheme } from '@mui/material/styles';

const SetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  // Choose which style to render based on your preference
  const useMaterialUI = true; // Set to false if you prefer Bootstrap style

  useEffect(() => {
    const tempToken = localStorage.getItem('tempToken');
    if (!tempToken) {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const tempToken = localStorage.getItem('tempToken');
      
      // Update the API endpoint to match your backend route
      const response = await axios.post('http://localhost:3001/api/auth/set-password', {
        newPassword,
        confirmPassword
      }, {
        headers: {
          Authorization: `Bearer ${tempToken}`
        }
      });
      
      setSuccess(true);
      localStorage.removeItem('tempToken');
      
      // Auto redirect after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err) {
      console.error('Error setting password:', err);
      setError(err.response?.data?.message || 'Failed to set password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return useMaterialUI ? (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor={theme.palette.background.default}
      >
        <Paper elevation={3} sx={{ p: 4, width: 400 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Password Set Successfully!
          </Typography>
          <Typography align="center">
            You will be redirected to login page shortly.
          </Typography>
        </Paper>
      </Box>
    ) : (
      <Container className="mt-5 text-center" style={{ maxWidth: '400px' }}>
        <h2 className="mb-3">Password Set Successfully!</h2>
        <p>You will be redirected to login page shortly.</p>
      </Container>
    );
  }

  return useMaterialUI ? (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor={theme.palette.background.default}
    >
      <Paper elevation={3} sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Set Your Password
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="New Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            autoComplete="new-password"
            inputProps={{
              'aria-label': 'New Password',
              minLength: 6
            }}
          />
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            inputProps={{
              'aria-label': 'Confirm Password',
              minLength: 6
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={isLoading}
          >
            {isLoading ? 'Setting password...' : 'Set Password'}
          </Button>
        </form>
      </Paper>
    </Box>
  ) : (
    <Container className="mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="text-center mb-4">Set Your Password</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength="6"
            autoComplete="new-password"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength="6"
            autoComplete="new-password"
          />
        </Form.Group>
        <Button 
          variant="primary" 
          type="submit" 
          disabled={isLoading}
          className="w-100"
        >
          {isLoading ? 'Setting password...' : 'Set Password'}
        </Button>
      </Form>
    </Container>
  );
};

export default SetPassword;