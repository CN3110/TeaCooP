import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import EmployeeLayout from "../../components/EmployeeLayout/EmployeeLayout";
import "./ViewSuppliers.css";

const ViewSuppliers = () => {
  const [searchId, setSearchId] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const navigate = useNavigate();

  // Fetch supplier data from the backend
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/suppliers");
        if (response.ok) {
          const data = await response.json();
          setSuppliers(data);
          setFilteredSuppliers(data); // Initialize filteredSuppliers with all suppliers
        } else {
          console.error("Failed to fetch suppliers");
        }
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    fetchSuppliers();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setSearchId(searchTerm);

    // Filter suppliers based on search term
    const filtered = suppliers.filter((supplier) =>
      supplier.supplierId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSuppliers(filtered);
  };

  // Navigate to the "Add New Supplier" page
  const handleAddSupplier = () => {
    navigate("/add-supplier");
  };

  return (
    <EmployeeLayout>
      <div className="view-supplier-container">
        <div className="content-header">
          <h3>View Suppliers</h3> {/* View Suppliers title */}

          <div className="header-activity">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by Supplier ID"
                value={searchId}
                onChange={handleSearchChange}
              />
              <BiSearch className="icon" />
            </div>
            <button className="add-supplier-btn" onClick={handleAddSupplier}>
              Add New Supplier
            </button>
          </div>
        </div>

        <table className="suppliers-table">
          <thead>
            <tr>
              <th>Supplier ID</th>
              <th>Supplier Name</th>
              <th>Contact Number</th>
              <th>Land Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.map((supplier) => (
              <tr key={supplier.supplierId}>
                <td>{supplier.supplierId}</td>
                <td>{supplier.supplierName}</td>
                <td>{supplier.supplierContactNumber}</td>
                <td>
                  <ul>
                    {supplier.landDetails.map((land, index) => (
                      <li key={index}>
                        <strong>Land No:</strong> {index + 1},{" "}
                        <strong>Size:</strong> {land.landSize},{" "}
                        <strong>Address:</strong> {land.landAddress}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </EmployeeLayout>
  );
};

export default ViewSuppliers;