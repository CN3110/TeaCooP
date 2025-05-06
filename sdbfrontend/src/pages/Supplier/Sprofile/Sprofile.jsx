import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import SupplierLayout from '../../../components/supplier/SupplierLayout/SupplierLayout';
import './sprofile.css';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Sprofile = () => {
  const { supplierId: paramSupplierId } = useParams();
  const supplierId = paramSupplierId || localStorage.getItem('userId');

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [supplier, setSupplier] = useState({
    supplierName: '',
    supplierContactNumber: '',
    supplierEmail: '',
    landDetails: []
  });

  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (!supplierId) {
      setLoading(false);
      showSnackbar('No supplier ID found. Please log in.', 'error');
      return;
    }

    fetchSupplierDetails();
  }, [supplierId]);

  const fetchSupplierDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3001/api/suppliers/${supplierId}`);
      setSupplier({
        ...response.data,
        landDetails: response.data.landDetails || []
      });
    } catch (error) {
      showSnackbar('Failed to load supplier details', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSupplier({ ...supplier, [name]: value });
  };

  const handleLandChange = (index, field, value) => {
    const updatedLand = [...supplier.landDetails];
    updatedLand[index] = { ...updatedLand[index], [field]: value };
    setSupplier({ ...supplier, landDetails: updatedLand });
  };

  const addLand = () => {
    setSupplier({
      ...supplier,
      landDetails: [...supplier.landDetails, { landSize: '', landAddress: '' }]
    });
  };

  const removeLand = (index) => {
    const updatedLand = [...supplier.landDetails];
    updatedLand.splice(index, 1);
    setSupplier({ ...supplier, landDetails: updatedLand });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/api/suppliers/${supplierId}`, {
        supplierName: supplier.supplierName,
        supplierContactNumber: supplier.supplierContactNumber,
        supplierEmail: supplier.supplierEmail,
        landDetails: supplier.landDetails
      });
      showSnackbar('Profile updated successfully');
      setIsEditing(false);
      fetchSupplierDetails();
    } catch (error) {
      showSnackbar('Failed to update profile', 'error');
      console.error(error);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
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

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!validatePasswords()) return;
    try {
      await axios.put(`http://localhost:3001/api/suppliers/${supplierId}/password`, {
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

  if (!supplierId) {
    return <div className="error-message">No supplier ID found. Please log in.</div>;
  }

  if (loading) {
    return <div className="loader-container"><div className="loader"></div></div>;
  }

  return (
    <SupplierLayout>
      <div className="supplier-profile-container">
        <div className="profile-header">
          <h1>My Profile</h1>
          {!isEditing && !changingPassword && (
            <button className="btn primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
          )}
        </div>

        {!changingPassword && (
          <form onSubmit={handleUpdateProfile} className="profile-form">
            <label>Supplier ID
              <input type="text" value={supplierId} disabled />
            </label>

            <label>Full Name
              <input type="text" name="supplierName" value={supplier.supplierName} onChange={handleInputChange} disabled={!isEditing} required />
            </label>

            <label>Contact Number
              <input type="text" name="supplierContactNumber" value={supplier.supplierContactNumber} onChange={handleInputChange} disabled={!isEditing} required />
            </label>

            <label>Email
              <input type="email" name="supplierEmail" value={supplier.supplierEmail} onChange={handleInputChange} disabled={!isEditing} required />
            </label>

            <div className="land-section">
              <h2>Land Details</h2>
              {isEditing && <button type="button" className="btn small" onClick={addLand}>Add Land</button>}
              {supplier.landDetails.map((land, index) => (
                <div key={index} className="land-card">
                  <label>Size (acres)
                    <input type="text" value={land.landSize} onChange={(e) => handleLandChange(index, 'landSize', e.target.value)} disabled={!isEditing} required />
                  </label>
                  <label>Address
                    <input type="text" value={land.landAddress} onChange={(e) => handleLandChange(index, 'landAddress', e.target.value)} disabled={!isEditing} required />
                  </label>
                  {isEditing && (
                    <button type="button" className="btn danger small" onClick={() => removeLand(index)}>Remove</button>
                  )}
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
    </SupplierLayout>
  );
};

export default Sprofile;
