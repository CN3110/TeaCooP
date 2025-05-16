import React, { useState, useEffect } from 'react'; // Added missing useState import
import TeaProductionForm from '../../components/TeaTypeStockManagement/Form/TeaTypeStockForm';
import TeaProductionList from '../../components/TeaTypeStockManagement/List/TeaTypeStockList';
import TeaTypeTotals from '../../components/TeaTypeStockManagement/TeaTypeTotals/TeaTypeTotals'; 
import EmployeeLayout from '../../components/EmployeeLayout/EmployeeLayout'; 


const TeaTypeStockManagement = () => {
  const [allocatedForTeaTypeCategorization, setAllocatedForTeaTypeCategorization] = useState(null); 

  useEffect(() => {
    const fetchAllocatedForTeaTypeCategorization = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/lots/made-tea-available-for-teaType-creation');
        const data = await res.json();
        setAllocatedForTeaTypeCategorization(data.availableWeight);
      } catch (err) {
        console.error('Error fetching categorization data:', err);
      }
    };
    fetchAllocatedForTeaTypeCategorization();
  }, []);


  
  return (
    <EmployeeLayout>
    <div className="tea-stock-management">
      <h1>Tea Type Stock Management</h1>
      {allocatedForTeaTypeCategorization !== null && (
          <h6 className="allocated-label">
            Allocated Made Tea Weight for Tea Type Categorizing: {parseFloat(allocatedForTeaTypeCategorization).toFixed(2)} kg
          </h6>
        )}
      <TeaTypeTotals/>
      <div className="management-sections" flexDirection="column">
     
      
        <div className="form-section">
          <TeaProductionForm /> 
          
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
