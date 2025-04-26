import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const TeaProductionForm = () => {
  const [teaTypes, setTeaTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    teaTypeId: '',
    productionDate: format(new Date(), 'yyyy-MM-dd'),
    weightInKg: '',
  });
  const [packetCount, setPacketCount] = useState(null);
  const [loadingTeaTypes, setLoadingTeaTypes] = useState(true);

  useEffect(() => {
    const fetchTeaTypes = async () => {
      try {
        setLoadingTeaTypes(true);
        const response = await axios.get('http://localhost:3001/api/teaTypes');
        
        // Check if response.data is an array
        if (Array.isArray(response.data)) {
          setTeaTypes(response.data);
          if (response.data.length > 0) {
            setFormData(prev => ({ ...prev, teaTypeId: response.data[0].teaTypeId }));
          }
        } else {
          console.error('Tea types response is not an array:', response.data);
          setTeaTypes([]); // Set empty array as fallback
        }
      } catch (error) {
        console.error('Error fetching tea types:', error);
        setTeaTypes([]); // Set empty array on error
      } finally {
        setLoadingTeaTypes(false);
      }
    };

    fetchTeaTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Calculate packets if it's dust tea and weight changes
    if (name === 'weightInKg' || name === 'teaTypeId') {
      const selectedTeaType = teaTypes.find(type => type.teaTypeId === parseInt(formData.teaTypeId));
      if (selectedTeaType && selectedTeaType.teaTypeName.toLowerCase() === 'dust tea' && formData.weightInKg) {
        const weight = name === 'weightInKg' ? parseFloat(value) : parseFloat(formData.weightInKg);
        if (!isNaN(weight)) {
          setPacketCount(Math.floor(weight * 1000 / 400));
        }
      } else {
        setPacketCount(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Get employee ID from localStorage
      const employeeId = localStorage.getItem('userId') 
      
      const response = await axios.post('http://localhost:3001/api/teaProductions', {
        ...formData,
        createdBy: employeeId
      });

      setMessage('Production record added successfully!');
      
      // Reset form
      setFormData({
        teaTypeId: teaTypes.length > 0 ? teaTypes[0].teaTypeId : '',
        productionDate: format(new Date(), 'yyyy-MM-dd'),
        weightInKg: '',
      });
      setPacketCount(null);
    } catch (error) {
      setMessage('Error adding production record. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tea-production-form">
      <h2>Add Tea Production Record</h2>
      
      {message && (
        <div className={message.includes('Error') ? 'error-message' : 'success-message'}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="productionDate">Production Date:</label>
          <input
            type="date"
            id="productionDate"
            name="productionDate"
            value={formData.productionDate}
            onChange={handleChange}
            required
          />
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
              {teaTypes.length === 0 && (
                <option value="">No tea types available</option>
              )}
              {Array.isArray(teaTypes) && teaTypes.map(type => (
                <option key={type.teaTypeId} value={type.teaTypeId}>
                  {type.teaTypeName}
                </option>
              ))}
            </select>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="weightInKg">Weight (kg):</label>
          <input
            type="number"
            id="weightInKg"
            name="weightInKg"
            step="0.01"
            min="0"
            value={formData.weightInKg}
            onChange={handleChange}
            required
          />
        </div>
        
        {packetCount !== null && (
          <div className="packet-info">
            <p>This will produce approximately <strong>{packetCount}</strong> packets of 400g Dust Tea</p>
          </div>
        )}
        
        <button type="submit" disabled={loading || loadingTeaTypes || teaTypes.length === 0}>
          {loading ? 'Adding...' : 'Add Production Record'}
        </button>
      </form>
    </div>
  );
};

export default TeaProductionForm;