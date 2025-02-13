import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import AboutUs from "./pages/About Us/AboutUs.jsx";
import Contact from "./pages/Contact/Contact";
import Footer from "./components/Footer/Footer.jsx";
import LoginPopup from "./components/LoginPopup/LoginPopup"; // Import LoginPopup
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap styles
import EmployeeDashboard from "./pages/Employee/EmployeeDashboard.jsx";
import AddSupplier from "./pages/AddSupplier/AddSupplier.jsx";
import ViewSuppliers from "./pages/ViewSuppliers/ViewSuppliers.jsx";
import AddDriver from "./pages/AddDriver/AddDriver.jsx";
import ViewDrivers from "./pages/ViewDrivers/ViewDrivers.jsx";

const App = () => {
  const [showLogin, setShowLogin] = useState(false); // Add state for LoginPopup

  return (
    <>
      <div className="app">
        <Navbar setShowLogin={setShowLogin} /> {/* Pass setShowLogin to Navbar */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/employeedashboard" element={<EmployeeDashboard />} />
          <Route path="/add-supplier" element={<AddSupplier/>} />
          <Route path="/view-suppliers" element={<ViewSuppliers/>} />
          <Route path="/add-driver" element={<AddDriver />} />
          <Route path="/view-drivers" element={<ViewDrivers/>}/>
        </Routes>
      </div>

      {/* Include LoginPopup with show/hide logic */}
      <LoginPopup show={showLogin} handleClose={() => setShowLogin(false)} />

      <Footer />
    </>
  );
};

export default App;
