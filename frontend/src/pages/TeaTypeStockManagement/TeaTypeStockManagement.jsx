import React from 'react';
import TeaProductionForm from '../../components/TeaTypeStockManagement/Form/TeaTypeStockForm';
import TeaProductionList from '../../components/TeaTypeStockManagement/List/TeaTypeStockList';


const TeaTypeStockManagement = () => {
  return (
    <div className="tea-stock-management">
      <h1>Tea Type Stock Management</h1>
      <div className="management-sections">
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
