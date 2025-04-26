import React from 'react';
import TeaProductionForm from '../../components/ProductionComponents/Form/TeaProductionForm';
import TeaProductionList from '../../components/ProductionComponents/List/TeaProductionList';

const TeaProductionPage = () => {
  return (
    <div className="tea-production-page">
      <h1>Tea Production Management</h1>
      
      <div className="tea-production-container">
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

export default TeaProductionPage;