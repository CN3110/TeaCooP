import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import BrokerLayout from '../../../components/broker/BrokerLayout/BrokerLayout';
import './BProfile.css';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const BProfile = () => {
  const { brokerId: paramBrokerId } = useParams();
  const brokerId = paramBrokerId || localStorage.getItem('userId');

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [broker, setBroker] = useState({
    brokerName: '',
    brokerContactNumber: '',
    brokerEmail: '',
    brokerCompanyName: '',
    brokerCompanyContact: '',
    brokerCompanyEmail: '',
    brokerCompanyAddress: ''
  });

  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (!brokerId) {
      setLoading(false);
      showSnackbar('No broker ID found. Please log in.', 'error');
      return;
    }
    fetchBrokerDetails();
  }, [brokerId]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const fetchBrokerDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3001/api/brokers/${brokerId}`);
      setBroker({
        brokerName: response.data.brokerName || '',
        brokerContactNumber: response.data.brokerContactNumber || '',
        brokerEmail: response.data.brokerEmail || '',
        brokerCompanyName: response.data.brokerCompanyName || '',
        brokerCompanyContact: response.data.brokerCompanyContact || '',
        brokerCompanyEmail: response.data.brokerCompanyEmail || '',
        brokerCompanyAddress: response.data.brokerCompanyAddress || ''
      });
    } catch (error) {
      showSnackbar('Failed to load broker details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBroker({ ...broker, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };

  const validateForm = () => {
    const requiredFields = [
      'brokerName', 'brokerContactNumber', 'brokerEmail',
      'brokerCompanyName', 'brokerCompanyContact',
      'brokerCompanyEmail', 'brokerCompanyAddress'
    ];
    for (const field of requiredFields) {
      if (!broker[field].trim()) {
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
      await axios.put(`http://localhost:3001/api/brokers/profile-edit/${brokerId}`, {
        brokerName: broker.brokerName,
        brokerContact: broker.brokerContactNumber,
        brokerEmail: broker.brokerEmail,
        brokerCompanyName: broker.brokerCompanyName,
        brokerCompanyContact: broker.brokerCompanyContact,
        brokerCompanyEmail: broker.brokerCompanyEmail,
        brokerCompanyAddress: broker.brokerCompanyAddress
      });

      showSnackbar('Profile updated successfully');
      setIsEditing(false);
      fetchBrokerDetails();
    } catch (error) {
      showSnackbar('Failed to update profile', 'error');
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!validatePasswords()) return;

    try {
      await axios.put(`http://localhost:3001/api/brokers/${brokerId}/password`, {
        newPassword: passwords.newPassword
      });
      showSnackbar('Password updated successfully');
      setChangingPassword(false);
      setPasswords({ newPassword: '', confirmPassword: '' });
    } catch (error) {
      showSnackbar('Failed to update password', 'error');
    }
  };

  if (!brokerId) return <div className="error-message">No broker ID found. Please log in.</div>;
  if (loading) return <div className="loader-container"><div className="loader"></div></div>;

  return (
    <BrokerLayout>
      <div className="broker-profile-container">
        <div className="profile-header">
          <h1>My Profile</h1>
          {!isEditing && !changingPassword && (
            <button className="btn primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
          )}
        </div>

        {!changingPassword && (
          <form onSubmit={handleUpdateProfile} className="profile-form">
            <label>ID
              <input type="text" value={brokerId} disabled />
            </label>
            <label>Full Name
              <input type="text" name="brokerName" value={broker.brokerName} onChange={handleInputChange} disabled={!isEditing} required />
            </label>
            <label>Contact Number
              <input type="text" name="brokerContactNumber" value={broker.brokerContactNumber} onChange={handleInputChange} disabled={!isEditing} required />
            </label>
            <label>Email
              <input type="email" name="brokerEmail" value={broker.brokerEmail} onChange={handleInputChange} disabled={!isEditing} required />
            </label>
            <label>Company Name
              <input type="text" name="brokerCompanyName" value={broker.brokerCompanyName} onChange={handleInputChange} disabled={!isEditing} required />
            </label>
            <label>Company Contact
              <input type="text" name="brokerCompanyContact" value={broker.brokerCompanyContact} onChange={handleInputChange} disabled={!isEditing} required />
            </label>
            <label>Company Email
              <input type="email" name="brokerCompanyEmail" value={broker.brokerCompanyEmail} onChange={handleInputChange} disabled={!isEditing} required />
            </label>
            <label>Company Address
              <textarea name="brokerCompanyAddress" value={broker.brokerCompanyAddress} onChange={handleInputChange} disabled={!isEditing} required />
            </label>

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
              <input type="password" name="newPassword" value={passwords.newPassword} onChange={handlePasswordChange} required />
            </label>
            <label>Confirm Password
              <input type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={handlePasswordChange} required />
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

        <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </BrokerLayout>
  );
};

export default BProfile;