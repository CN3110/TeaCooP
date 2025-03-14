import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import AboutUs from "./pages/About Us/AboutUs.jsx";
import Contact from "./pages/Contact/Contact";
import Footer from "./components/Footer/Footer.jsx";
import LoginPopup from "./components/LoginPopup/LoginPopup"; 
import "bootstrap/dist/css/bootstrap.min.css"; //Bootstrap styles
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

const App = () => {
  const [showLogin, setShowLogin] = useState(false); // Add state for LoginPopup

  return (
    <>
      <div className="app">
        <Navbar setShowLogin={setShowLogin} /> {/* Pass setShowLogin to Navbar */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/aboutus-view-tea-varieties" element={<ViewTeaTypesHome/>} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/employeedashboard" element={<EmployeeDashboard />} />
          <Route path="/add-supplier" element={<AddSupplier/>} />
          <Route path="/view-suppliers" element={<ViewSuppliers/>} />
          <Route path="/add-driver" element={<AddDriver />} />
          <Route path="/view-drivers" element={<ViewDrivers/>}/>
          <Route path="/add-new-delivery-record" element={<AddNewDeliveryRecord/>} />
          <Route path="/view-delivery-records" element={<ViewDeliveryRecords />} />
          <Route path="/edit-delivery-record/:deliveryId" element={<EditDeliveryRecord />} /> {/* Add route for EditDeliveryRecord in view records screen - edit button*/}
          <Route path="/edit-supplier/:supplierId" element={<EditSupplier />} /> {/* Add route for EditSupplierPage */}
          <Route path="/edit-driver/:driverId" element={<EditDriver />} />
          <Route path="/add-broker" element={<AddBroker />} />
          <Route path="/view-brokers" element={<ViewBrokers />} />
          <Route path="/edit-broker/:brokerId" element={<EditBroker />} />
          <Route path="/add-tea-type" element={<AddTeaType />} />
          <Route path="/view-tea-types" element={<ViewTeaTypes />} /> 
          <Route path="/edit-tea-type/:teaTypeId" element={<EditTeaType />} /> {/* Add route for EditTeaType */}
          <Route path="/employee-dashboard-create-lot" element={<CreateLot/>} />
          <Route path="/view-lots" element={<ViewLots/>} />
          <Route path="/edit-lot/:lotNumber" element={<EditLot/>} />
          <Route path="/supplierdashboard" element={<SupplierDashboard/>} />
          <Route path="/supplier-request-transport" element={<RequestTransport/>}/>
          
        </Routes>
      </div>

      {/* Include LoginPopup with show/hide logic */}
      <LoginPopup show={showLogin} handleClose={() => setShowLogin(false)} />

      <Footer />
    </>
  );
};

export default App;