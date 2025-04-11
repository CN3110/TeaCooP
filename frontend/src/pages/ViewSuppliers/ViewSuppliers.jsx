import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import EmployeeLayout from "../../components/EmployeeLayout/EmployeeLayout";
import EditSupplier from "./EditSupplier";
import "./ViewSuppliers.css";

const ViewSuppliers = () => {
  const [searchId, setSearchId] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const navigate = useNavigate();

  // Fetch all suppliers including disabled ones
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/suppliers");
        if (response.ok) {
          const data = await response.json();
          setSuppliers(data);
          setFilteredSuppliers(data); // Initialize with all suppliers
        } else {
          console.error("Failed to fetch suppliers");
        }
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    fetchSuppliers();
  }, []);

  // Apply filters whenever search or status changes
  useEffect(() => {
    let filtered = [...suppliers];

    // Apply search filter
    if (searchId) {
      filtered = filtered.filter((supplier) =>
        supplier.supplierId.toLowerCase().includes(searchId.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((supplier) => supplier.status === statusFilter);
    }

    setFilteredSuppliers(filtered);
  }, [searchId, statusFilter, suppliers]);

  const handleSearchChange = (e) => {
    setSearchId(e.target.value);
  };

  const handleAddSupplier = () => {
    navigate("/add-supplier");
  };

  const handleEdit = (supplier) => {
    navigate(`/edit-supplier/${supplier.supplierId}`);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSupplier(null);
  };

  return (
    <EmployeeLayout>
      <div className="view-supplier-container">
        <div className="content-header">
          <h3>View Suppliers</h3>
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
            <div className="filters">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="status-filter"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="disabled">Disabled</option>
              </select>
              <button className="add-supplier-btn" onClick={handleAddSupplier}>
                Add New Supplier
              </button>
            </div>
          </div>
        </div>

        <table className="suppliers-table">
          <thead>
            <tr>
              <th>Supplier ID</th>
              <th>Supplier Name</th>
              <th>Contact Number</th>
              <th>Email</th>
              <th>Status</th>
              <th>Land Details</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredSuppliers.length > 0 ? (
              filteredSuppliers.map((supplier) => (
                <tr key={supplier.supplierId}>
                  <td>{supplier.supplierId}</td>
                  <td>{supplier.supplierName}</td>
                  <td>{supplier.supplierContactNumber}</td>
                  <td>{supplier.supplierEmail}</td>
                  <td className={`status-cell status-${supplier.status}`}>
                    {supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}
                  </td>
                  <td>
                    <ul className="land-details-list">
                      {supplier.landDetails && supplier.landDetails.length > 0 ? (
                        supplier.landDetails.map((land, index) => (
                          <li key={index}>
                            <span className="land-detail-label">Land {index + 1}:</span>
                            <span>Size: {land.landSize} acres</span>
                            <span>Address: {land.landAddress}</span>
                            {land.delivery_routeName && (
                              <span>Route: {land.delivery_routeName}</span>
                            )}
                          </li>
                        ))
                      ) : (
                        <li>No land details available</li>
                      )}
                    </ul>
                  </td>
                  <td className="supplier-notes">
                    {supplier.notes || "No notes available"}
                  </td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(supplier)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-results">
                  No suppliers found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <EditSupplier supplier={selectedSupplier} onClose={closeModal} />
            </div>
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
};

export default ViewSuppliers;