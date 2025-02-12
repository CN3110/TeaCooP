import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import EmployeeLayout from "../../components/EmployeeLayout/EmployeeLayout";
import "./ViewSuppliers.css";

const ViewSuppliers = () => {
  const [searchId, setSearchId] = useState("");
  const navigate = useNavigate();

  // Sample supplier data (replace with real data from an API or state)
  const [suppliers, setSuppliers] = useState([
    { id: "500001", name: "-", contact: "-", size: "-", address: "-" },
    { id: "500002", name: "-", contact: "-", size: "-", address: "-" },
    { id: "500003", name: "-", contact: "-", size: "-", address: "-" },
    { id: "500004", name: "-", contact: "-", size: "-", address: "-" },
  ]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchId(e.target.value);
  };

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Add logic to filter suppliers based on searchId
    console.log("Search for Supplier ID:", searchId);
  };

  // Navigate to the "Add New Supplier" page
  const handleAddSupplier = () => {
    navigate("/add-supplier");
  };

  return (
    <EmployeeLayout>
      <div className="view-supplier-container">
        <div className="content-header">
          <h3>View Suppliers</h3>

          <div className="header-activity">
            <div className="search-box">
              <input type="text" placeholder="Search by Supplier ID" />
              <BiSearch className="icon" />
            </div>
          </div>
        </div>

        <table className="suppliers-table">
          <thead>
            <tr>
              <th>Supplier ID</th>
              <th>Supplier Name</th>
              <th>Contact Number</th>
              <th>Size of Land</th>
              <th>Land Address</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier.id}>
                <td>{supplier.id}</td>
                <td>{supplier.name}</td>
                <td>{supplier.contact}</td>
                <td>{supplier.size}</td>
                <td>{supplier.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </EmployeeLayout>
  );
};

export default ViewSuppliers;
