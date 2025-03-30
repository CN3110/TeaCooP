import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Alert,
  Avatar
} from '@mui/material';
import { orange } from '@mui/material/colors';

const BrokerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    brokerName: '',
    brokerContactNumber: '',
    brokerEmail: '',
    brokerCompanyName: '',
    brokerCompanyContact: '',
    brokerCompanyEmail: '',
    brokerCompanyAddress: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setProfile(response.data);
        setFormData({
          brokerName: response.data.brokerName,
          brokerContactNumber: response.data.brokerContactNumber,
          brokerEmail: response.data.brokerEmail,
          brokerCompanyName: response.data.brokerCompanyName,
          brokerCompanyContact: response.data.brokerCompanyContact,
          brokerCompanyEmail: response.data.brokerCompanyEmail,
          brokerCompanyAddress: response.data.brokerCompanyAddress
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/brokers/${profile.brokerId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setSuccess('Profile updated successfully');
      // Refresh profile data
      const response = await axios.get('/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProfile(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Typography>Loading...</Typography>;
  if (!profile) return <Typography>No profile data found</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar 
            sx={{ 
              bgcolor: orange[500], 
              width: 56, 
              height: 56,
              mr: 2
            }}
          >
            {profile.brokerName.charAt(0)}
          </Avatar>
          <Typography variant="h4">Broker Profile</Typography>
        </Box>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Broker ID"
            variant="outlined"
            fullWidth
            margin="normal"
            value={profile.brokerId}
            disabled
          />
          <TextField
            label="Full Name"
            name="brokerName"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.brokerName}
            onChange={handleChange}
            required
          />
          <TextField
            label="Contact Number"
            name="brokerContactNumber"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.brokerContactNumber}
            onChange={handleChange}
            required
          />
          <TextField
            label="Email"
            name="brokerEmail"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.brokerEmail}
            onChange={handleChange}
            required
          />
          
          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            Company Information
          </Typography>
          
          <TextField
            label="Company Name"
            name="brokerCompanyName"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.brokerCompanyName}
            onChange={handleChange}
            required
          />
          <TextField
            label="Company Contact"
            name="brokerCompanyContact"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.brokerCompanyContact}
            onChange={handleChange}
            required
          />
          <TextField
            label="Company Email"
            name="brokerCompanyEmail"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.brokerCompanyEmail}
            onChange={handleChange}
            required
          />
          <TextField
            label="Company Address"
            name="brokerCompanyAddress"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={formData.brokerCompanyAddress}
            onChange={handleChange}
            required
          />
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default BrokerProfile;