import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
  Snackbar,
  Alert,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  Grid,
  IconButton,
  InputAdornment
} from '@mui/material';
import {
  Edit,
  Lock,
  Save,
  Cancel,
  Person,
  Phone,
  Email,
  Badge
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import EmployeeLayout from '../../../components/EmployeeLayout/EmployeeLayout';

const DarkGreenButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.success.dark,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.success.main,
  },
}));

const EProfile = () => {
  const { employeeId: paramEmployeeId } = useParams();
  const employeeId = paramEmployeeId || localStorage.getItem('userId');

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  const [employee, setEmployee] = useState({
    employeeName: '',
    employeeContact_no: '',
    employeeEmail: '',
  });

  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (!employeeId) {
      setLoading(false);
      showSnackbar('No employee ID found. Please log in.', 'error');
      return;
    }
    fetchEmployeeDetails();
  }, [employeeId]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchEmployeeDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3001/api/employees/${employeeId}`);
      setEmployee({
        employeeName: response.data.employeeName || '',
        employeeContact_no: response.data.employeeContact_no || '',
        employeeEmail: response.data.employeeEmail || '',
      });
    } catch (error) {
      showSnackbar('Failed to load employee details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };

  const validateForm = () => {
    const requiredFields = ['employeeName', 'employeeContact_no', 'employeeEmail'];
    for (const field of requiredFields) {
      if (!employee[field].trim()) {
        showSnackbar(`Field ${field} is required`, 'error');
        return false;
      }
    }
    return true;
  };

  const validatePasswords = () => {
    if (passwords.newPassword.length < 6) {
      showSnackbar('Password must be at least 6 characters', 'error');
      return false;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      showSnackbar('Passwords do not match', 'error');
      return false;
    }
    return true;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.put(`http://localhost:3001/api/employees/profile/${employeeId}`, employee);
      showSnackbar('Profile updated successfully');
      setIsEditing(false);
      fetchEmployeeDetails();
    } catch (error) {
      showSnackbar('Failed to update profile', 'error');
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!validatePasswords()) return;

    try {
      await axios.put(`http://localhost:3001/api/employees/${employeeId}/password`, {
        newPassword: passwords.newPassword
      });
      showSnackbar('Password updated successfully');
      setChangingPassword(false);
      setPasswords({ newPassword: '', confirmPassword: '' });
    } catch (error) {
      showSnackbar('Failed to update password', 'error');
    }
  };

  if (!employeeId) {
    return (
      <EmployeeLayout>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="error">
            No employee ID found. Please log in.
          </Typography>
        </Box>
      </EmployeeLayout>
    );
  }

  if (loading) {
    return (
      <EmployeeLayout>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '80vh' 
        }}>
          <CircularProgress color="success" size={60} />
        </Box>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3 
        }}>
          <Typography variant="h4" color="success.dark">
            Employee Profile
          </Typography>
          
          {!isEditing && !changingPassword && (
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => setIsEditing(true)}
              color="success"
            >
              Edit Profile
            </Button>
          )}
        </Box>

        {/* Profile Form */}
        {!changingPassword && (
          <Card elevation={3} sx={{ mb: 3 }}>
            <CardContent>
              <form onSubmit={handleUpdateProfile}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6" color="success.dark" gutterBottom>
                      Personal Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Employee ID"
                      value={employeeId}
                      disabled
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Badge color="success" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="employeeName"
                      value={employee.employeeName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person color={isEditing ? "primary" : "disabled"} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Contact Number"
                      name="employeeContact_no"
                      value={employee.employeeContact_no}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone color={isEditing ? "primary" : "disabled"} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="employeeEmail"
                      type="email"
                      value={employee.employeeEmail}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email color={isEditing ? "primary" : "disabled"} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {isEditing && (
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <DarkGreenButton
                          type="submit"
                          variant="contained"
                          startIcon={<Save />}
                        >
                          Save Changes
                        </DarkGreenButton>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<Cancel />}
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Password Change Form */}
        {changingPassword ? (
          <Card elevation={3}>
            <CardContent>
              <form onSubmit={handleUpdatePassword}>
                <Typography variant="h6" color="success.dark" gutterBottom>
                  Change Password
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="New Password"
                      name="newPassword"
                      type="password"
                      value={passwords.newPassword}
                      onChange={handlePasswordChange}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      value={passwords.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                      <DarkGreenButton
                        type="submit"
                        variant="contained"
                        startIcon={<Save />}
                      >
                        Update Password
                      </DarkGreenButton>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Cancel />}
                        onClick={() => setChangingPassword(false)}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        ) : (
          !isEditing && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                variant="contained"
                startIcon={<Lock />}
                onClick={() => setChangingPassword(true)}
                color="success"
              >
                Change Password
              </Button>
            </Box>
          )
        )}

        {/* Snackbar */}
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={3000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </EmployeeLayout>
  );
};

export default EProfile;