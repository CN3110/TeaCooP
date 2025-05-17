import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";
import EmployeeLayout from "../../../components/EmployeeLayout/EmployeeLayout";
import "./ViewLots.css";
import { BiSearch } from "react-icons/bi";

const ViewLots = () => {
  // State to store lot data, tea types, search term, pagination, and UI feedback
  const [lots, setLots] = useState([]);
  const [teaTypes, setTeaTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, lotNumber: null });

  const lotsPerPage = 10;
  const navigate = useNavigate();

  // Fetch lots and tea types from the server on initial render
  useEffect(() => {
    const fetchData = async () => {
      try {
        const lotsResponse = await fetch("http://localhost:3001/api/lots");
        if (!lotsResponse.ok) throw new Error("Failed to fetch lots");
        const lotsData = await lotsResponse.json();

        const teaTypesResponse = await fetch("http://localhost:3001/api/teaTypes");
        if (!teaTypesResponse.ok) throw new Error("Failed to fetch tea types");
        const teaTypesData = await teaTypesResponse.json();

        setLots(lotsData);
        setTeaTypes(teaTypesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setSnackbar({ open: true, message: "Failed to load data.", severity: "error" });
      }
    };

    fetchData();
  }, []);

  // Get tea type name by its ID
  const getTeaTypeName = (teaTypeId) => {
    const teaType = teaTypes.find((type) => type.teaTypeId === teaTypeId);
    return teaType ? teaType.teaTypeName : "Unknown";
  };

  // Navigate to edit lot page
  const handleEdit = (lotNumber) => {
    navigate(`/edit-lot/${lotNumber}`);
  };

  // Open confirmation dialog before deleting a lot
  const confirmDeleteLot = (lotNumber) => {
    setConfirmDialog({ open: true, lotNumber });
  };

  // Handle confirmed lot deletion
  const handleDeleteConfirmed = async () => {
    const { lotNumber } = confirmDialog;
    setConfirmDialog({ open: false, lotNumber: null });

    try {
      const response = await fetch(`http://localhost:3001/api/lots/${lotNumber}`, {
        method: "DELETE"
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to delete lot");

      // Remove the deleted lot from the state
      setLots((prev) => prev.filter((lot) => lot.lotNumber !== lotNumber));
      setSnackbar({ open: true, message: "Lot deleted successfully", severity: "success" });
    } catch (error) {
      console.error("Error deleting lot:", error);
      setSnackbar({
        open: true,
        message: error.message.includes("valuations")
          ? "Cannot delete this lot. Brokers have added valuations."
          : "Failed to delete lot.",
        severity: "error"
      });
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Filter lots based on search term
  const filteredLots = lots.filter((lot) =>
    lot.lotNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const indexOfLastLot = currentPage * lotsPerPage;
  const indexOfFirstLot = indexOfLastLot - lotsPerPage;
  const currentLots = filteredLots.slice(indexOfFirstLot, indexOfLastLot);
  const totalPages = Math.ceil(filteredLots.length / lotsPerPage);

  return (
    <EmployeeLayout>
      <div className="lot-list-container">
        {/* Header Section */}
        <div className="content-header">
          <h3>Lot List</h3>
          <div className="header-activity">
            {/* Search bar */}
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by Lot Number"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <BiSearch className="icon" />
            </div>
            {/* Add new lot button */}
            <button className="add-lot-btn" onClick={() => navigate("/employee-dashboard-create-lot")}>
              Add New Lot
            </button>
          </div>
        </div>

        {/* Lots Table */}
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
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentLots.map((lot) => (
              <tr key={lot.lotNumber}>
                <td>{lot.lotNumber}</td>
                <td>{new Date(lot.manufacturingDate).toLocaleDateString()}</td>
                <td>{getTeaTypeName(lot.teaTypeId)}</td>
                <td>{lot.noOfBags}</td>
                <td>{lot.netWeight}</td>
                <td>{lot.totalNetWeight}</td>
                <td>{lot.valuationPrice}</td>
                <td>{lot.notes}</td>
                <td>
                  <div className="form-buttons">
                    <button className="edit-button" onClick={() => handleEdit(lot.lotNumber)}>
                      Edit
                    </button>
                    <button className="delete-button" onClick={() => confirmDeleteLot(lot.lotNumber)}>
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

        {/* Pagination Buttons */}
        <div className="pagination">
          <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, lotNumber: null })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this lot?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, lotNumber: null })}>Cancel</Button>
          <Button color="error" onClick={handleDeleteConfirmed}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </EmployeeLayout>
  );
};

export default ViewLots;
