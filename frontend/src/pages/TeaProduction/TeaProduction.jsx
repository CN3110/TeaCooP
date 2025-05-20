import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import TeaProductionForm from '../../components/ProductionComponents/Form/TeaProductionForm';
import TeaProductionList from '../../components/ProductionComponents/List/TeaProductionList';
import './TeaProduction.css';
import EmployeeLayout from '../../components/EmployeeLayout/EmployeeLayout'; 
import AdminLayout from '../../components/AdminLayout/AdminLayout';

const TeaProductionPage = () => {
  const navigate = useNavigate();

  
const userRole = localStorage.getItem('userRole');
const Layout = userRole === 'admin' ? AdminLayout : EmployeeLayout;

  return (
    <Layout> 
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
    </Layout>
  );
};

export default TeaProductionPage;