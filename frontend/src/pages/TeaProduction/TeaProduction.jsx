import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import TeaProductionForm from '../../components/ProductionComponents/Form/TeaProductionForm';
import TeaProductionList from '../../components/ProductionComponents/List/TeaProductionList';
import './TeaProduction.css';
import EmployeeLayout from '../../components/EmployeeLayout/EmployeeLayout'; 


const TeaProductionPage = () => {
  const navigate = useNavigate();

  return (
    <EmployeeLayout> 
    <div className="tea-production-page">
      <div className="page-header">
        
        <h1>Tea Production Management</h1>
      </div>
      
      <div className="tea-production-container">
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

export default TeaProductionPage;