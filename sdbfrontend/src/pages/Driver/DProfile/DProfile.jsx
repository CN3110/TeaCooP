import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import DriverLayout from "../../../components/Driver/DriverLayout/DriverLayout";
import './DProfile.css';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const DProfile = () => {
  const { driverId: paramDriverId } = useParams();
  const driverId = paramDriverId || localStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole');

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [driver, setDriver] = useState({
    driverName: '',
    driverContactNumber: '',
    driverEmail: '',
    vehicleDetails: []
  });

  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (!driverId) {
      setLoading(false);
      showSnackbar('No driver ID found. Please log in.', 'error');
      return;
    }

    fetchDriverDetails();
  }, [driverId]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchDriverDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3001/api/drivers/${driverId}`);
      setDriver({
        ...response.data,
        vehicleDetails: response.data.vehicleDetails || []
      });
    } catch (error) {
      showSnackbar('Failed to load driver details', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDriver({ ...driver, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };

  const handleVehicleChange = (index, field, value) => {
    const updatedVehicles = [...driver.vehicleDetails];
    updatedVehicles[index] = { ...updatedVehicles[index], [field]: value };
    setDriver({ ...driver, vehicleDetails: updatedVehicles });
  };

  const addVehicle = () => {
    setDriver({
      ...driver,
      vehicleDetails: [...driver.vehicleDetails, { vehicleNumber: '', vehicleType: '' }]
    });
  };

  const removeVehicle = (index) => {
    const updatedVehicles = [...driver.vehicleDetails];
    updatedVehicles.splice(index, 1);
    setDriver({ ...driver, vehicleDetails: updatedVehicles });
  };

  const validateForm = () => {
    if (!driver.driverName.trim()) {
      showSnackbar('Name is required', 'error');
      return false;
    }
    if (!driver.driverContactNumber.trim()) {
      showSnackbar('Contact number is required', 'error');
      return false;
    }
    if (!driver.driverEmail.trim()) {
      showSnackbar('Email is required', 'error');
      return false;
    }
    for (const vehicle of driver.vehicleDetails) {
      if (!vehicle.vehicleNumber.trim() || !vehicle.vehicleType.trim()) {
        showSnackbar('All vehicle fields are required', 'error');
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
      await axios.put(`http://localhost:3001/api/drivers/${driverId}`, {
        driverName: driver.driverName,
        driverContactNumber: driver.driverContactNumber,
        driverEmail: driver.driverEmail,
        status: driver.status,
        notes: driver.notes,
        vehicleDetails: driver.vehicleDetails
      });
      showSnackbar('Profile updated successfully');
      setIsEditing(false);
      fetchDriverDetails();
    } catch (error) {
      showSnackbar('Failed to update profile', 'error');
      console.error(error);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!validatePasswords()) return;
    try {
      await axios.put(`http://localhost:3001/api/drivers/${driverId}/password`, {
        newPassword: passwords.newPassword
      });
      showSnackbar('Password updated successfully');
      setChangingPassword(false);
      setPasswords({ newPassword: '', confirmPassword: '' });
    } catch (error) {
      showSnackbar('Failed to update password', 'error');
      console.error(error);
    }
  };

  if (!driverId) {
    return <div className="error-message">No driver ID found. Please log in.</div>;
  }

  if (loading) {
    return <div className="loader-container"><div className="loader"></div></div>;
  }

  return (
    <DriverLayout>
    <div className="driver-profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        {!isEditing && !changingPassword && (
          <button className="btn primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
        )}
      </div>

      {!changingPassword && (
        <form onSubmit={handleUpdateProfile} className="profile-form">
          <label>ID
            <input type="text" value={driver.driverId || ''} disabled />
          </label>

          <label>Name
            <input type="text" name="driverName" value={driver.driverName} onChange={handleInputChange} disabled={!isEditing} required />
          </label>

          <label>Contact Number
            <input type="text" name="driverContactNumber" value={driver.driverContactNumber} onChange={handleInputChange} disabled={!isEditing} required />
          </label>

          <label>Email
            <input type="email" name="driverEmail" value={driver.driverEmail} onChange={handleInputChange} disabled={!isEditing} required />
          </label>

         <div className="vehicle-section">
            <h2>Vehicle Details</h2>
            {isEditing && <button type="button" className="btn small" onClick={addVehicle}>Add Vehicle</button>}
            {driver.vehicleDetails.map((vehicle, index) => (
              <div key={index} className="vehicle-card">
                <div className="vehicle-row">
                  <label>Vehicle Number
                    <input type="text" value={vehicle.vehicleNumber} onChange={(e) => handleVehicleChange(index, 'vehicleNumber', e.target.value)} disabled={!isEditing} required />
                  </label>
                  <label>Vehicle Type
                    <input type="text" value={vehicle.vehicleType} onChange={(e) => handleVehicleChange(index, 'vehicleType', e.target.value)} disabled={!isEditing} required />
                  </label>
                  {isEditing && (
                    <button type="button" className="btn danger small" onClick={() => removeVehicle(index)}>Remove</button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {isEditing && (
            <div className="form-actions">
              <button type="submit" className="btn success">Save Changes</button>
              <button type="button" className="btn secondary" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          )}
        </form>
      )}

      {changingPassword ? (
        <form onSubmit={handleUpdatePassword} className="password-form">
          <h2>Change Password</h2>
          <label>New Password
            <input type="password" name="newPassword" value={passwords.newPassword} onChange={handlePasswordChange} required minLength="6" />
          </label>
          <label>Confirm Password
            <input type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={handlePasswordChange} required minLength="6" />
          </label>
          <div className="form-actions">
            <button type="submit" className="btn primary">Update Password</button>
            <button type="button" className="btn secondary" onClick={() => setChangingPassword(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        !isEditing && (
          <div className="change-password">
            <button className="btn info" onClick={() => setChangingPassword(true)}>Change Password</button>
          </div>
        )
      )}

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
    </DriverLayout>
  );
};

export default DProfile;
