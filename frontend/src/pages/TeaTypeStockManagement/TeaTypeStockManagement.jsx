import React, { useState, useEffect, useCallback } from 'react';
import TeaProductionForm from '../../components/TeaTypeStockManagement/Form/TeaTypeStockForm';
import TeaProductionList from '../../components/TeaTypeStockManagement/List/TeaTypeStockList';
import TeaTypeTotals from '../../components/TeaTypeStockManagement/TeaTypeTotals/TeaTypeTotals'; 
import EmployeeLayout from '../../components/EmployeeLayout/EmployeeLayout'; 
import AdminLayout from '../../components/AdminLayout/AdminLayout';

const TeaTypeStockManagement = () => {
  const [allocatedForTeaTypeCategorization, setAllocatedForTeaTypeCategorization] = useState(null); 
  const [usedForTeaTypeCategorization, setUsedForTeaTypeCategorization] = useState(null);
  const [availableWeight, setAvailableWeight] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use useCallback to memoize the fetch function so it can be passed as a stable prop
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch both data in parallel
      const [allocatedRes, usedRes] = await Promise.all([
        fetch('http://localhost:3001/api/lots/made-tea-available-for-teaType-creation'),
        fetch('http://localhost:3001/api/teaTypeStocks/total')
      ]);

      if (!allocatedRes.ok || !usedRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const [allocatedData, usedData] = await Promise.all([
        allocatedRes.json(),
        usedRes.json()
      ]);

      const allocated = allocatedData.availableWeight || 0;
      const used = usedData.total || 0;
      const available = allocated - used;

      setAllocatedForTeaTypeCategorization(allocated);
      setUsedForTeaTypeCategorization(used);
      setAvailableWeight(available);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  
const userRole = localStorage.getItem('userRole');
const Layout = userRole === 'admin' ? AdminLayout : EmployeeLayout;

  if (isLoading) {
    return (
      <Layout>
        <div className="tea-stock-management">
          <h1>Tea Type Stock Management</h1>
          <p>Loading data...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="tea-stock-management">
          <h1>Tea Type Stock Management</h1>
          <p className="error-message">Error: {error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="tea-stock-management">
        <h1 style = {{color: 'rgb(32, 84, 34)'}}>Tea Type Stock Management</h1>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div style={{
            background: '#e8f5e9',
            borderLeft: '6px solid #43a047',
            padding: '1rem',
            flex: '1',
            borderRadius: '8px',
            minWidth: '250px'
          }}>
            <h5 style={{ color: '#2e7d32' }}>Allocated Made Tea Weight</h5>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {parseFloat(allocatedForTeaTypeCategorization).toFixed(2)} kg
            </p>
          </div>
          <div style={{
            background: '#f1f8e9',
            borderLeft: '6px solid #9ccc65',
            padding: '1rem',
            flex: '1',
            borderRadius: '8px',
            minWidth: '250px'
          }}>
            <h5 style={{ color: '#689f38' }}>Used Made Tea Weight</h5>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {parseFloat(usedForTeaTypeCategorization).toFixed(2)} kg
            </p>
          </div>
          <div style={{
            background: '#e0f2f1',
            borderLeft: '6px solid #26a69a',
            padding: '1rem',
            flex: '1',
            borderRadius: '8px',
            minWidth: '250px'
          }}>
            <h5 style={{ color: '#00796b' }}>Available Made Tea Weight</h5>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {parseFloat(availableWeight).toFixed(2)} kg
            </p>
          </div>
        </div>

        <TeaTypeTotals 
          allocated={allocatedForTeaTypeCategorization}
          used={usedForTeaTypeCategorization}
          available={availableWeight}
        />
        
        <div className="management-sections" style={{ flexDirection: 'column' }}>
          <div className="form-section">
            <TeaProductionForm
              availableWeight={availableWeight}
              onSuccess={fetchData}  
            />
          </div>
          <div className="list-section">
            <TeaProductionList />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TeaTypeStockManagement;
