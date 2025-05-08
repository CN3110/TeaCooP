import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import img1 from '../../../assets/Carousel-img1.jpg'; 

const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`http://localhost:3001/api/auth/login`, { userId, password });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userRole', response.data.role);
      localStorage.setItem('userId', response.data.userId);
      if (response.data.name) localStorage.setItem('userName', response.data.name);

      switch (response.data.role) {
        case 'supplier':
          navigate('/supplier-dashboard');
          break;
        case 'driver':
          navigate('/driver-dashboard');
          break;
        case 'broker':
          navigate('/broker-dashboard');
          break;
        default:
          setError('Unknown user role.');
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Login failed. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url(${img1})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <Paper elevation={5} sx={{ p: 4, width: 400, backdropFilter: 'blur(6px)', backgroundColor: 'rgba(255,255,255,0.85)' }}>
        <Typography variant="h5" mb={3} align="center">
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="User ID"
            fullWidth
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
