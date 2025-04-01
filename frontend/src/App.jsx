import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext.jsx';
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import AboutUs from "./pages/About Us/AboutUs.jsx";
import Contact from "./pages/Contact/Contact";
import Footer from "./components/Footer/Footer.jsx";
import Login from "./pages/Login/Login.jsx";
import EmployeeProfile from "./pages/Employee/ProfileEM/ProfileEM.jsx";
import EmployeeDashboard from "./pages/Employee/EmployeeDashboard.jsx";
import AddSupplier from "./pages/AddSupplier/AddSupplier.jsx";
import ViewSuppliers from "./pages/ViewSuppliers/ViewSuppliers.jsx";
import AddDriver from "./pages/AddDriver/AddDriver.jsx";
import ViewDrivers from "./pages/ViewDrivers/ViewDrivers.jsx";
import AddNewDeliveryRecord from "./pages/ManageDeliveriesEM/AddNewDeliveryRecord/AddNewDeliveryRecord/AddNewDeliveryRecord.jsx";
import ViewDeliveryRecords from "./pages/ManageDeliveriesEM/ViewDeliveryRecords/ViewDeliveryRecords.jsx";
import EditSupplier from "./pages/ViewSuppliers/EditSupplier.jsx";
import EditDriver from "./pages/ViewDrivers/EditDriver.jsx";
import AddBroker from "./pages/ManageBrokers/AddBroker/AddBroker.jsx";
import ViewBrokers from "./pages/ManageBrokers/ViewBrokers/ViewBrokers.jsx";
import EditBroker from "./pages/ManageBrokers/EditBroker/EditBroker.jsx";
import EditDeliveryRecord from "./pages/ManageDeliveriesEM/ViewDeliveryRecords/EditDeliveryRecord.jsx";
import AddTeaType from "./pages/TeaTypes/AddTeaType/AddTeaType.jsx";
import ViewTeaTypes from "./pages/TeaTypes/ViewTeaTypes/ViewTeaTypes.jsx";
import EditTeaType from "./pages/TeaTypes/EditTeaType/EditTeaType.jsx";
import CreateLot from "./pages/SalesEM/CreateLot/CreateLot.jsx";
import ViewLots from "./pages/SalesEM/ViewLots/ViewLots.jsx";
import EditLot from "./pages/SalesEM/EditLot/EditLot.jsx";
import ViewTeaTypesHome from "./pages/About Us/View Tea Types_Home/ViewTeaTypesHome.jsx";
import SupplierDashboard from "./pages/SupplierView/Dashboard/SupplierDashboard.jsx";
import RequestTransport from "./pages/SupplierView/RequestTransport/RequestTransport.jsx";
import ViewTransportRequests from "./pages/ViewTransportRequests/ViewTransportRequests.jsx";
import DriverDashboard from "./pages/DriverView/DashboardDriver/DashboardDriver.jsx";
import BrokerDashboard from "./pages/BrokerView/DashboardBroker/DashboardBroker.jsx";
import ManageDeliveryRoutes from "./pages/ManageDeliveryRoutes/ManageDeliveryRoutes.jsx";
import BrokerLotManagement from "./pages/BrokerView/BrokerLotManagement/BrokerLotManagement.jsx";
import SetPassword from "./pages/SetPassword/SetPassword.jsx";
import ViewValuations from "./pages/SalesEM/ViewValuations/ViewValuations.jsx";
import ConfirmedLots from "./pages/BrokerView/BrokerLotManagement/ConfirmedLots.jsx";

// PrivateRoute component for authentication and authorization
const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if route requires specific roles and user has one of them
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.userType)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Role-specific route components
const EmployeeRoute = ({ children }) => (
  <PrivateRoute allowedRoles={['employee']}>{children}</PrivateRoute>
);

const SupplierRoute = ({ children }) => (
  <PrivateRoute allowedRoles={['supplier']}>{children}</PrivateRoute>
);

const DriverRoute = ({ children }) => (
  <PrivateRoute allowedRoles={['driver']}>{children}</PrivateRoute>
);

const BrokerRoute = ({ children }) => (
  <PrivateRoute allowedRoles={['broker']}>{children}</PrivateRoute>
);

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/aboutus-view-tea-varieties" element={<ViewTeaTypesHome />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/set-password" element={
              <PrivateRoute>
                <SetPassword />
              </PrivateRoute>
            } />

            {/* Employee Routes */}
            <Route path="/employee-dashboard" element={
              <EmployeeRoute>
                <EmployeeDashboard />
              </EmployeeRoute>
            } />
            <Route path="/add-supplier" element={
              <EmployeeRoute>
                <AddSupplier />
              </EmployeeRoute>
            } />
            <Route path="/view-suppliers" element={
              <EmployeeRoute>
                <ViewSuppliers />
              </EmployeeRoute>
            } />
            <Route path="/edit-supplier/:supplierId" element={
              <EmployeeRoute>
                <EditSupplier />
              </EmployeeRoute>
            } />
            <Route path="/add-driver" element={
              <EmployeeRoute>
                <AddDriver />
              </EmployeeRoute>
            } />
            <Route path="/view-drivers" element={
              <EmployeeRoute>
                <ViewDrivers />
              </EmployeeRoute>
            } />
            <Route path="/edit-driver/:driverId" element={
              <EmployeeRoute>
                <EditDriver />
              </EmployeeRoute>
            } />
            <Route path="/add-new-delivery-record" element={
              <EmployeeRoute>
                <AddNewDeliveryRecord />
              </EmployeeRoute>
            } />
            <Route path="/view-delivery-records" element={
              <EmployeeRoute>
                <ViewDeliveryRecords />
              </EmployeeRoute>
            } />
            <Route path="/edit-delivery-record/:deliveryId" element={
              <EmployeeRoute>
                <EditDeliveryRecord />
              </EmployeeRoute>
            } />
            <Route path="/add-broker" element={
              <EmployeeRoute>
                <AddBroker />
              </EmployeeRoute>
            } />
            <Route path="/view-brokers" element={
              <EmployeeRoute>
                <ViewBrokers />
              </EmployeeRoute>
            } />
            <Route path="/edit-broker/:brokerId" element={
              <EmployeeRoute>
                <EditBroker />
              </EmployeeRoute>
            } />
            <Route path="/add-tea-type" element={
              <EmployeeRoute>
                <AddTeaType />
              </EmployeeRoute>
            } />
            <Route path="/view-tea-types" element={
              <EmployeeRoute>
                <ViewTeaTypes />
              </EmployeeRoute>
            } />
            <Route path="/edit-tea-type/:teaTypeId" element={
              <EmployeeRoute>
                <EditTeaType />
              </EmployeeRoute>
            } />
            <Route path="/employee-dashboard-create-lot" element={
              <EmployeeRoute>
                <CreateLot />
              </EmployeeRoute>
            } />
            <Route path="/view-lots" element={
              <EmployeeRoute>
                <ViewLots />
              </EmployeeRoute>
            } />
            <Route path="/edit-lot/:lotNumber" element={
              <EmployeeRoute>
                <EditLot />
              </EmployeeRoute>
            } />
            <Route path="/view-valuations/:lotNumber" element={
              <EmployeeRoute>
                <ViewValuations />
              </EmployeeRoute>
            } />
            <Route path="/employee-dashboard-manage-delivery-routes" element={
              <EmployeeRoute>
                <ManageDeliveryRoutes />
              </EmployeeRoute>
            } />
            <Route path="/profile/:userId" element={
              <PrivateRoute>
                <EmployeeProfile />
              </PrivateRoute>
            } />
            <Route path="/employee-view-transport-requests" element={
              <EmployeeRoute>
                <ViewTransportRequests />
              </EmployeeRoute>
            } />

            {/* Supplier Routes */}
            <Route path="/supplier-dashboard" element={
              <SupplierRoute>
                <SupplierDashboard />
              </SupplierRoute>
            } />
            <Route path="/supplier-request-transport" element={
              <SupplierRoute>
                <RequestTransport />
              </SupplierRoute>
            } />

            {/* Driver Routes */}
            <Route path="/driver-dashboard" element={
              <DriverRoute>
                <DriverDashboard />
              </DriverRoute>
            } />

            {/* Broker Routes */}
            <Route path="/broker-dashboard" element={
              <BrokerRoute>
                <BrokerDashboard />
              </BrokerRoute>
            } />
            <Route path="/broker-manage-lots" element={
              <BrokerRoute>
                <BrokerLotManagement />
              </BrokerRoute>
            } />
            <Route path="/broker-confirmed-lots" element={
              <BrokerRoute>
                <ConfirmedLots />
              </BrokerRoute>
            } />
          </Routes>
        </div>
        <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App;