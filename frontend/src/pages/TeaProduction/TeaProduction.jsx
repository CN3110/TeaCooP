//import side bar
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import TeaProductionForm from '../../components/ProductionComponents/Form/TeaProductionForm';
import TeaProductionList from '../../components/ProductionComponents/List/TeaProductionList';
import './TeaProduction.css';

const TeaProductionPage = () => {
  const navigate = useNavigate();

  return (
    <div className="tea-production-page">
      <div className="page-header">
        <button 
          className="back-button"
          onClick={() => navigate(-1)} // Go back to previous page
        >
          <FiArrowLeft className="back-icon" />
          Back
        </button>
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
  );
};

export default TeaProductionPage;