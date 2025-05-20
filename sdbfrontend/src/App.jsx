import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
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
import BProfile from './pages/Broker/BProfile/BProfile';
import ViewDeliveryRecords from './pages/Driver/ViewDeliveryRecords/ViewDeliveryRecords';
import ViewNewLots from './pages/Broker/ViewNewLots/ViewNewLots';
import ViewTeaTypes from './pages/View Tea Types/ViewTeaTypes';
import Login from './pages/Home Page/Login/Login'
import BrokerMyValuations from './pages/Broker/MyValuations/BrokerMyValuations';
import BrokerConfirmLots from './pages/Broker/BrokerConfirmLots/BrokerConfirmLots';
import SoldPriceManagement from './pages/Broker/SoldPriceManagement/SoldPriceManagement';
import SupplierNotices from './pages/Supplier/SupplierNotices/SupplierNotices';
import DriverNotices from './pages/Driver/DriverNotices/DriverNotices';
import BrokerNotices from './pages/Broker/BrokerNotices/BrokerNotices';

const App = () => {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          {/* Common Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/view-tea-varieties" element={<ViewTeaTypes />} />
         

          {/* Supplier Routes */}
          <Route path="/supplier-dashboard" element={<SupplierDashboard />} />
          <Route path="/supplier-notices" element={<SupplierNotices />} />
          <Route path="/supplier-profile" element={<SProfile />} />
          <Route path="/request-transport" element={<RequestTransport />} />
          <Route path="/supplier-delivery-history" element={<SupplierDeliveryHistory />} />


          {/* Driver Routes */}
          <Route path="/driver-dashboard" element={<DriverNotices />} />
          <Route path="/driver-profile" element={<DProfile />} />
          <Route path="/driver-view-transport-requests" element={<ViewTransportRequests />} />
          <Route path="/driver-delivery-history" element={<ViewDeliveryRecords />} />
          <Route path="/driver-notices" element={<DriverNotices />} />

          {/* Broker Routes */}
          <Route path="/broker-dashboard" element={<BrokerNotices />} />
          <Route path="/broker-profile" element={<BProfile />} />
          <Route path="/broker-view-new-lots" element={<ViewNewLots />} />
          <Route path="/broker-my-valuations" element={<BrokerMyValuations />} />
          <Route path="/broker-confirm-lots" element={<BrokerConfirmLots />} />
          <Route path="/broker-sold-price-management" element={<SoldPriceManagement />} />
          <Route path="/broker-notices" element={<BrokerNotices />} />

          {/* 404 Not Found Route */}

         
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
