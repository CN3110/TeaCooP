import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import EmployeeLayout from '../../../components/EmployeeLayout/EmployeeLayout';
import './EProfile.css'; 

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const EProfile = () => {
  const { employeeId: paramEmployeeId } = useParams();
  const employeeId = paramEmployeeId || localStorage.getItem('userId');

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

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
      await axios.put(`http://localhost:3001/api/employees/${employeeId}`, employee);
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

  if (!employeeId) return <div className="error-message">No employee ID found. Please log in.</div>;
  if (loading) return <div className="loader-container"><div className="loader"></div></div>;

  return (
    <EmployeeLayout>
      <div className="employee-profile-container">
        <div className="profile-header">
          <h1>My Profile</h1>
          {!isEditing && !changingPassword && (
            <button className="btn primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
          )}
        </div>

        {!changingPassword && (
          <form onSubmit={handleUpdateProfile} className="profile-form">
            <label>ID
              <input type="text" value={employeeId} disabled />
            </label>
            <label>Full Name
              <input type="text" name="employeeName" value={employee.employeeName} onChange={handleInputChange} disabled={!isEditing} required />
            </label>
            <label>Contact Number
              <input type="text" name="employeeContact_no" value={employee.employeeContact_no} onChange={handleInputChange} disabled={!isEditing} required />
            </label>
            <label>Email
              <input type="email" name="employeeEmail" value={employee.employeeEmail} onChange={handleInputChange} disabled={!isEditing} required />
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
    </EmployeeLayout>
  );
};

export default EProfile;
