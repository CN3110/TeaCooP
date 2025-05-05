import React from 'react';
import TeaProductionForm from '../../components/TeaTypeStockManagement/Form/TeaTypeStockForm';
import TeaProductionList from '../../components/TeaTypeStockManagement/List/TeaTypeStockList';
import TeaTypeTotals from '../../components/TeaTypeStockManagement/TeaTypeTotals/TeaTypeTotals';  


const TeaTypeStockManagement = () => {
  return (
    <div className="tea-stock-management">
      <h1>Tea Type Stock Management</h1>
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
  );
};

export default TeaTypeStockManagement;
