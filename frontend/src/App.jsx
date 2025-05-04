import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext.jsx';
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./components/Footer/Footer.jsx";
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
import ViewTransportRequests from "./pages/ViewTransportRequests/ViewTransportRequests.jsx";
import ManageDeliveryRoutes from "./pages/ManageDeliveryRoutes/ManageDeliveryRoutes.jsx";
import ViewValuations from "./pages/SalesEM/ViewValuations/ViewValuations.jsx";
import ManageBrokerValuations from "./pages/SalesEM/ManageBrokerValuations/ManageBrokerValuations.jsx";
import AddEmployee from "./pages/ManageEmployees/AddEmployee/AddEmployee.jsx";
import ViewEmployees from "./pages/ManageEmployees/ViewEmployees/ViewEmployees.jsx";
import EditEmployee from "./pages/ManageEmployees/EditEmployee/EditEmployee.jsx";
import Login from "./pages/Login/Login.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard/AdminDashboard.jsx";
import TeaProductionPage from "./pages/TeaProduction/TeaProduction.jsx";
import NoticeForm from "./pages/NoticeManagement/NoticeForm/NoticeForm.jsx";
import NoticeList from "./pages/NoticeManagement/NoticeList/NoticeList.jsx";
import EditNotice from "./pages/NoticeManagement/EditNotice/EditNotice.jsx";
import RawTeaRecords from "./pages/RawTeaRecords/RawTeaRecords.jsx";
import TeaTypeStockManagement from "./pages/TeaTypeStockManagement/TeaTypeStockManagement.jsx";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            
           
            <Route path="/profile/:userId" element={<EmployeeProfile />} />

            {/* Employee Routes */}
            <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
            <Route path="/add-supplier" element={<AddSupplier />} />
            <Route path="/view-suppliers" element={<ViewSuppliers />} />
            <Route path="/edit-supplier/:supplierId" element={<EditSupplier />} />
            <Route path="/add-driver" element={<AddDriver />} />
            <Route path="/view-drivers" element={<ViewDrivers />} />
            <Route path="/edit-driver/:driverId" element={<EditDriver />} />
            <Route path="/add-new-delivery-record" element={<AddNewDeliveryRecord />} />
            <Route path="/view-delivery-records" element={<ViewDeliveryRecords />} />
            <Route path="/edit-delivery-record/:deliveryId" element={<EditDeliveryRecord />} />
            <Route path="/add-broker" element={<AddBroker />} />
            <Route path="/view-brokers" element={<ViewBrokers />} />
            <Route path="/edit-broker/:brokerId" element={<EditBroker />} />
            <Route path="/add-tea-type" element={<AddTeaType />} />
            <Route path="/view-tea-types" element={<ViewTeaTypes />} />
            <Route path="/edit-tea-type/:teaTypeId" element={<EditTeaType />} />
            <Route path="/employee-dashboard-create-lot" element={<CreateLot />} />
            <Route path="/view-lots" element={<ViewLots />} />
            <Route path="/edit-lot/:lotNumber" element={<EditLot />} />
            <Route path="/employee-dashboard-manage-delivery-routes" element={<ManageDeliveryRoutes />} />
            <Route path="/employee-view-transport-requests" element={<ViewTransportRequests />} />
            <Route path="/employee-view-manage-broker-valuation-price" element={<ManageBrokerValuations/>} />
            <Route path="/view-valuations/:lotNumber" element={<ViewValuations />} />
            <Route path="/tea-production" element={<TeaProductionPage />} />
            <Route path="/raw-tea-records" element={<RawTeaRecords />} />
            <Route path="/tea-type-stock-management" element={<TeaTypeStockManagement />} />

            {/* Admin Routes */}
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/add-employee" element={<AddEmployee />} />
            <Route path="/view-employees" element={<ViewEmployees />} />
            <Route path="/edit-employee/:employeeId" element={<EditEmployee />} />
            <Route path="/notice-list" element={<NoticeList />} />
            <Route path="/notice-form" element={<NoticeForm />} />
            <Route path="/notices/edit/:id" element={<NoticeForm />} />
            <Route path="/edit-notice/:id" element={<EditNotice />} />

            {/* Other Routes */}

           
          </Routes>
        </div>
        <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App;
