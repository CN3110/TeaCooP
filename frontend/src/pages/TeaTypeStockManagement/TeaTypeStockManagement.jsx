import React, { useState, useEffect, useCallback } from 'react';
import TeaProductionForm from '../../components/TeaTypeStockManagement/Form/TeaTypeStockForm';
import TeaProductionList from '../../components/TeaTypeStockManagement/List/TeaTypeStockList';
import TeaTypeTotals from '../../components/TeaTypeStockManagement/TeaTypeTotals/TeaTypeTotals'; 
import EmployeeLayout from '../../components/EmployeeLayout/EmployeeLayout'; 

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

  if (isLoading) {
    return (
      <EmployeeLayout>
        <div className="tea-stock-management">
          <h1>Tea Type Stock Management</h1>
          <p>Loading data...</p>
        </div>
      </EmployeeLayout>
    );
  }

  if (error) {
    return (
      <EmployeeLayout>
        <div className="tea-stock-management">
          <h1>Tea Type Stock Management</h1>
          <p className="error-message">Error: {error}</p>
        </div>
      </EmployeeLayout>
    );
  }

  return (
    <EmployeeLayout>
      <div className="tea-stock-management">
        <h1>Tea Type Stock Management</h1>
        
        <div className="weight-info">
          <h6 className="allocated-label">
            Allocated Made Tea Weight for Tea Type Categorizing: {parseFloat(allocatedForTeaTypeCategorization).toFixed(2)} kg
          </h6>
          <h6 className="used-label">
            Used Made Tea Weight for Tea Type Categorizing: {parseFloat(usedForTeaTypeCategorization).toFixed(2)} kg
          </h6>
          <h6 className="available-label">
            Available Made Tea Weight: {parseFloat(availableWeight).toFixed(2)} kg
          </h6>
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
    </EmployeeLayout>
  );
};

export default TeaTypeStockManagement;
