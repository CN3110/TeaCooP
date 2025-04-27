import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import './TeaProductionForm.css';

const TeaProductionForm = () => {
  const [teaTypes, setTeaTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    teaTypeId: '',
    productionDate: format(new Date(), 'yyyy-MM-dd'),
    weightInKg: '',
  });
  const [packetCount, setPacketCount] = useState(null);
  const [loadingTeaTypes, setLoadingTeaTypes] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' // 'success', 'error', 'warning', 'info'
  });

  useEffect(() => {
    const fetchTeaTypes = async () => {
      try {
        setLoadingTeaTypes(true);
        const response = await axios.get('http://localhost:3001/api/teaTypes');
        
        if (Array.isArray(response.data)) {
          setTeaTypes(response.data);
          
        } else {
          console.error('Tea types response is not an array:', response.data);
          setTeaTypes([]);
          showSnackbar('Failed to load tea types. Please refresh the page.', 'error');
        }
      } catch (error) {
        console.error('Error fetching tea types:', error);
        setTeaTypes([]);
        showSnackbar('Failed to load tea types. Please refresh the page.', 'error');
      } finally {
        setLoadingTeaTypes(false);
      }
    };

    fetchTeaTypes();
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is updated
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Calculate packets if it's dust tea and weight changes
    if (name === 'weightInKg' || name === 'teaTypeId') {
      const selectedTeaType = teaTypes.find(type => type.teaTypeId === parseInt(formData.teaTypeId));
      if (selectedTeaType && selectedTeaType.teaTypeName.toLowerCase() === 'dust tea' && formData.weightInKg) {
        const weight = name === 'weightInKg' ? parseFloat(value) : parseFloat(formData.weightInKg);
        if (!isNaN(weight) && weight > 0) {
          setPacketCount(Math.floor(weight * 1000 / 400));
        } else {
          setPacketCount(null);
        }
      } else {
        setPacketCount(null);
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const selectedDate = new Date(formData.productionDate);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate > today) {
      errors.productionDate = 'Production date cannot be in the future';
    }
    
    const weight = parseFloat(formData.weightInKg);
    if (isNaN(weight) || weight <= 0) {
      errors.weightInKg = 'Weight must be greater than zero';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showSnackbar('Please correct the errors in the form', 'error');
      return;
    }
    
    setLoading(true);

    try {
      const employeeId = localStorage.getItem('userId');
      
      await axios.post('http://localhost:3001/api/teaProductions', {
        ...formData,
        createdBy: employeeId
      });

      showSnackbar('Production record added successfully!');
      
      // Reset form
      setFormData({
        teaTypeId: teaTypes.length > 0 ? teaTypes[0].teaTypeId : '',
        productionDate: format(new Date(), 'yyyy-MM-dd'),
        weightInKg: '',
      });
      setPacketCount(null);
    } catch (error) {
      console.error('Error:', error);
      showSnackbar(
        error.response?.data?.message || 'Error adding production record. Please try again.', 
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <div className="tea-production-form">
      <h2>Add Tea Production Record</h2>
      
      <form onSubmit={handleSubmit}>
        <div className={`form-group ${formErrors.productionDate ? 'error' : ''}`}>
          <label htmlFor="productionDate">Production Date:</label>
          <input
            type="date"
            id="productionDate"
            name="productionDate"
            value={formData.productionDate}
            onChange={handleChange}
            required
            max={format(new Date(), 'yyyy-MM-dd')}
          />
          {formErrors.productionDate && (
            <div className="error-text">{formErrors.productionDate}</div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="teaTypeId">Tea Type:</label>
          {loadingTeaTypes ? (
            <p>Loading tea types...</p>
          ) : (
            <select
  id="teaTypeId"
  name="teaTypeId"
  value={formData.teaTypeId}
  onChange={handleChange}
  required
>
  <option value="">Select Tea Type</option> {/* This will show first */}
  {teaTypes.map(type => (
    <option key={type.teaTypeId} value={type.teaTypeId}>
      {type.teaTypeName}
    </option>
  ))}
</select>
          )}
        </div>
        
        <div className={`form-group ${formErrors.weightInKg ? 'error' : ''}`}>
          <label htmlFor="weightInKg">Weight (kg):</label>
          <input
            type="number"
            id="weightInKg"
            name="weightInKg"
            step="0.01"
            min="0.01"
            value={formData.weightInKg}
            onChange={handleChange}
            required
          />
          {formErrors.weightInKg && (
            <div className="error-text">{formErrors.weightInKg}</div>
          )}
        </div>
        
        {packetCount !== null && (
          <div className="packet-info">
            <p>This will produce approximately <strong>{packetCount}</strong> packets of 400g Dust Tea</p>
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={loading || loadingTeaTypes || teaTypes.length === 0}
          className={loading ? 'loading-button' : ''}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Adding...
            </>
          ) : (
            'Add Production Record'
          )}
        </button>
      </form>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            fontWeight: "bold",
            fontSize: "1rem",
            backgroundColor:
              snackbar.severity === "success"
                ? "rgb(14, 152, 16)"
                : snackbar.severity === "error"
                ? "rgb(211,47,47)"
                : snackbar.severity === "warning"
                ? "rgb(237, 201, 72)"
                : "#1976d2",
            color: "white",
            boxShadow: 3,
          }}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default TeaProductionForm;