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
import { green } from '@mui/material/colors';

const SupplierProfile = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    supplierName: '',
    supplierContactNumber: '',
    supplierEmail: ''
  });
  const [landDetails, setLandDetails] = useState([]);
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
          supplierName: response.data.supplierName,
          supplierContactNumber: response.data.supplierContactNumber,
          supplierEmail: response.data.supplierEmail
        });
        
        // Fetch land details if available
        if (response.data.landDetails) {
          setLandDetails(response.data.landDetails);
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
      await axios.put(`/api/suppliers/${profile.supplierId}`, formData, {
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
              bgcolor: green[500], 
              width: 56, 
              height: 56,
              mr: 2
            }}
          >
            {profile.supplierName.charAt(0)}
          </Avatar>
          <Typography variant="h4">Supplier Profile</Typography>
        </Box>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Supplier ID"
            variant="outlined"
            fullWidth
            margin="normal"
            value={profile.supplierId}
            disabled
          />
          <TextField
            label="Full Name"
            name="supplierName"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.supplierName}
            onChange={handleChange}
            required
          />
          <TextField
            label="Contact Number"
            name="supplierContactNumber"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.supplierContactNumber}
            onChange={handleChange}
            required
          />
          <TextField
            label="Email"
            name="supplierEmail"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.supplierEmail}
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
        
        {landDetails.length > 0 && (
          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              Land Details
            </Typography>
            <List>
              {landDetails.map((land, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`Land ${index + 1}`}
                    secondary={`Size: ${land.landSize} acres | Address: ${land.landAddress}`}
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

export default SupplierProfile;