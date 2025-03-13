import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import EmployeeLayout from "../../components/EmployeeLayout/EmployeeLayout";
import EditSupplier from "./EditSupplier"; // Import the EditSupplier component
import "./ViewSuppliers.css";

const ViewSuppliers = () => {
  const [searchId, setSearchId] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [selectedSupplier, setSelectedSupplier] = useState(null); // State for selected supplier
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

   // Handle edit button click
const handleEdit = (supplier) => {
  console.log("Edit button clicked, navigating to edit page"); // Debugging log
  navigate(`/edit-supplier/${supplier.supplierId}`); // Navigate to the edit page
};

  // Handle delete button click
  const handleDelete = async (supplierId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this supplier?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(
          `http://localhost:3001/api/suppliers/${supplierId}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          // Remove the deleted supplier from the state
          setSuppliers((prevSuppliers) =>
            prevSuppliers.filter(
              (supplier) => supplier.supplierId !== supplierId
            )
          );
          setFilteredSuppliers((prevFiltered) =>
            prevFiltered.filter(
              (supplier) => supplier.supplierId !== supplierId
            )
          );
          alert("Supplier deleted successfully!");
        } else {
          alert("Failed to delete supplier.");
        }
      } catch (error) {
        console.error("Error deleting supplier:", error);
        alert("An error occurred while deleting the supplier.");
      }
    }
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSupplier(null);
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
              <th>Actions</th>
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
                    {supplier.landDetails && supplier.landDetails.length > 0 ? (
                      supplier.landDetails.map((land, index) => (
                        <li key={index}>
                          <strong>Land No:</strong> {index + 1},{" "}
                          <strong>Size:</strong> {land.landSize},{" "}
                          <strong>Address:</strong> {land.landAddress}
                        </li>
                      ))
                    ) : (
                      <li>No land details available</li>
                    )}
                  </ul>
                </td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(supplier)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(supplier.supplierId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Edit Supplier Modal */}
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