import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Alert,
  Avatar,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { blue } from '@mui/material/colors';

const DriverProfile = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    driverName: '',
    driverContactNumber: '',
    driverEmail: ''
  });
  const [vehicleDetails, setVehicleDetails] = useState([]);
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
          driverName: response.data.driverName,
          driverContactNumber: response.data.driverContactNumber,
          driverEmail: response.data.driverEmail
        });
        
        // Fetch vehicle details if available
        if (response.data.vehicleDetails) {
          setVehicleDetails(response.data.vehicleDetails);
        }
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
      await axios.put(`/api/drivers/${profile.driverId}`, formData, {
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
              bgcolor: blue[500], 
              width: 56, 
              height: 56,
              mr: 2
            }}
          >
            {profile.driverName.charAt(0)}
          </Avatar>
          <Typography variant="h4">Driver Profile</Typography>
        </Box>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Driver ID"
            variant="outlined"
            fullWidth
            margin="normal"
            value={profile.driverId}
            disabled
          />
          <TextField
            label="Full Name"
            name="driverName"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.driverName}
            onChange={handleChange}
            required
          />
          <TextField
            label="Contact Number"
            name="driverContactNumber"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.driverContactNumber}
            onChange={handleChange}
            required
          />
          <TextField
            label="Email"
            name="driverEmail"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.driverEmail}
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
        
        {vehicleDetails.length > 0 && (
          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              Vehicle Details
            </Typography>
            <List>
              {vehicleDetails.map((vehicle, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`Vehicle ${index + 1}`}
                    secondary={`Number: ${vehicle.vehicleNumber} | Type: ${vehicle.vehicleType}`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default DriverProfile;