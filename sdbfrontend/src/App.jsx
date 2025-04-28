import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import HomePage from './pages/Home Page/HomePage';
import SupplierDashboard from './pages/Supplier/SupplierDashboard/SupplierDashboard';
import SProfile from './pages/Supplier/Sprofile/Sprofile';
import RequestTransport from './pages/Supplier/RequestTransport/RequestTransport';
import SupplierDeliveryHistory from './pages/Supplier/SupplierDeliveryHistory/SupplierDeliveryHistory';
import DriverDashboard from './pages/Driver/DriverDashboard/DriverDashboard';
import DProfile from './pages/Driver/Dprofile/Dprofile';
import ViewTransportRequests from './pages/Driver/ViewTransportRequests/ViewTransportRequests';
import BrokerDashboard from './pages/Broker/BrokerDashboard/BrokerDashboard';
import BProfile from './pages/Broker/Bprofile/Bprofile';
import ViewDeliveryRecords from './pages/Driver/ViewDeliveryRecords/ViewDeliveryRecords';
import ViewNewLots from './pages/Broker/ViewNewLots/ViewNewLots';
import ViewTeaTypes from './pages/View Tea Types/ViewTeaTypes';

const App = () => {
  //const [showLogin, setShowLogin] = useState(false); // Move login state here
  return (
    
    <div className="app">
      
        <Routes>
          {/* Common Routes */}
          <Route path="/" element={<HomePage showLogin={showLogin} setShowLogin={setShowLogin} />} />
          <Route path="/view-tea-varieties" element={<ViewTeaTypes />} />

          {/* Supplier Routes */}
          <Route path="/supplier-dashboard" element={<SupplierDashboard/>} />
          <Route path="/supplier-profile" element={<SProfile/>} />
          <Route path="/request-transport" element={<RequestTransport/>} />
          <Route path="/supplier-delivery-history" element={<SupplierDeliveryHistory/>} />          

          {/* Driver routes */}
          <Route path="/driver-dashboard" element={<DriverDashboard/>} />
          <Route path="/driver-profile" element={<DProfile/>} />
          <Route path="/driver-view-transport-requests" element={<ViewTransportRequests/>} />
          <Route path="/driver-delivery-history" element={<ViewDeliveryRecords/>} />

          {/* Broker Routes */}
          <Route path="/broker-dashboard" element={<BrokerDashboard/>} />
          <Route path="/broker-profile" element={<BProfile/>} />
          <Route path="/broker-view-new-lots" element={<ViewNewLots/>} />
        </Routes>
        
        <Footer />
    
    
    </div>
 
  );
}

export default App;