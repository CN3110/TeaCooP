import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Box, 
  TextField,  // Make sure this is imported
  Button, 
  Typography, 
  Paper, 
  Alert as MuiAlert 
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
  
    try {
      console.log('Attempting login with:', { userId, passcode });
      const response = await axios.post('http://localhost:3001/api/auth/login', { 
        userId, 
        passcode 
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Login response:', response.data);
      
      if (response.data.needsPassword) {
        localStorage.setItem('tempToken', response.data.token);
        navigate('/set-password');
      } else {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userType', response.data.userType);
        
        switch(response.data.userType) {
          case 'employee':
            navigate('/employee-dashboard');
            break;
          case 'supplier':
            navigate('/supplierdashboard');
            break;
          case 'driver':
            navigate('/driverdashboard');
            break;
          case 'broker':
            navigate('/brokerdashboard');
            break;
          default:
            navigate('/');
        }
      }
    } catch (err) {
        console.error('Login error:', err);
        const errorMessage = err.response?.data?.message || 
                            err.response?.data?.error || 
                            'Login failed. Please try again.';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor={theme.palette.background.default}
    >
      <Paper elevation={3} sx={{ p: 4, width: 400 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Tea Supply Management
        </Typography>
        
        {error && <MuiAlert severity="error" sx={{ mb: 2 }}>{error}</MuiAlert>}
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="User ID"
            variant="outlined"
            fullWidth
            margin="normal"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            autoComplete="username"  // Fixes Chrome warning
          />
          <TextField
            label="Passcode/Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            required
            autoComplete="current-password"  // Fixes Chrome warning
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;