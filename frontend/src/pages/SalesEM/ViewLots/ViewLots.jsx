import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeLayout from "../../../components/EmployeeLayout/EmployeeLayout";
import "./ViewLots.css"; // Add custom styles if needed
import { BiSearch } from "react-icons/bi"; // Import search icon

const ViewLots = () => {
  const [lots, setLots] = useState([]); // State to store lot data
  const [teaTypes, setTeaTypes] = useState([]); // State to store tea types
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const navigate = useNavigate();

  // Fetch all lots from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch lots
        const lotsResponse = await fetch("http://localhost:3001/api/lots");
        if (!lotsResponse.ok) throw new Error("Failed to fetch lots");
        const lotsData = await lotsResponse.json();

        // Fetch tea types
        const teaTypesResponse = await fetch("http://localhost:3001/api/teaTypes");
        if (!teaTypesResponse.ok) throw new Error("Failed to fetch tea types");
        const teaTypesData = await teaTypesResponse.json();

        setLots(lotsData);
        setTeaTypes(teaTypesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load data. Please try again.");
      }
    };

    fetchData();
  }, []);

  // Function to get tea type name by ID
  const getTeaTypeName = (teaTypeId) => {
    const teaType = teaTypes.find(type => type.teaTypeId === teaTypeId);
    return teaType ? teaType.teaTypeName : "Unknown";
  };

  // Handle Edit button click
  const handleEdit = (lotNumber) => {
    navigate(`/edit-lot/${lotNumber}`); // Navigate to the edit page
  };

  // Handle Delete button click
  const handleDelete = async (lotNumber) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this lot?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/lots/${lotNumber}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete lot");
      }

      // Remove the deleted lot from the state
      setLots(lots.filter((lot) => lot.lotNumber !== lotNumber));
      alert("Lot deleted successfully!");
    } catch (error) {
      console.error("Error deleting lot:", error);
      alert("Failed to delete lot. Please try again.");
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter lots based on search term (e.g., by Lot Number)
  const filteredLots = lots.filter((lot) =>
    lot.lotNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <EmployeeLayout>
      <div className="lot-list-container">
        <div className="content-header">
          <h3>Lot List</h3>
          <div className="header-activity">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by Lot Number"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <BiSearch className="icon" />
            </div>
            <button
              className="add-lot-btn"
              onClick={() => navigate("/employee-dashboard-create-lot")} // Navigate to the add lot page
            >
              Add New Lot
            </button>
          </div>
        </div>
        <table className="lot-table">
  <thead>
    <tr>
      <th>Lot Number</th>
      <th>Manufacturing Date</th>
      <th>Tea Type</th>
      <th>No. of Bags</th>
      <th>Net Weight (kg)</th>
      <th>Total Net Weight (kg)</th>
      <th>Valuation Price (LKR)</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {filteredLots.map((lot) => (
      <tr key={lot.lotNumber}>
        <td>{lot.lotNumber}</td>
        <td>{new Date(lot.manufacturingDate).toLocaleDateString()}</td>
        <td>{getTeaTypeName(lot.teaTypeId)}</td>
        <td>{lot.noOfBags}</td>
        <td>{lot.netWeight}</td>
        <td>{lot.totalNetWeight}</td>
        <td>{lot.valuationPrice}</td>
        <td>
          <div className="form-buttons">
            <button
              className="edit-button"
              onClick={() => handleEdit(lot.lotNumber)}
            >
              Edit
            </button>
            <button
              className="delete-button"
              onClick={() => handleDelete(lot.lotNumber)}
            >
              Delete
            </button>
            <button
              className="view-valuations-button"
              onClick={() => navigate(`/view-valuations/${lot.lotNumber}`)}
            >
              View Valuations
            </button>
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>
      </div>
    </EmployeeLayout>
  );
};

export default ViewLots;
