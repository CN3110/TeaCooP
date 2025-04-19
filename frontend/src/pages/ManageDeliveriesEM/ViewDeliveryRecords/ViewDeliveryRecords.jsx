import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import EmployeeLayout from "../../../components/EmployeeLayout/EmployeeLayout";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import "./ViewDeliveryRecords.css";

const ViewDeliveryRecords = () => {
  const [supplierId, setSupplierId] = useState("");
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // success | error | warning | info
  });

  const showAlert = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeliveryRecords = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/deliveries");
        if (response.ok) {
          const data = await response.json();
          setDeliveries(data);
          setFilteredDeliveries(data);
        } else {
          console.error("Failed to fetch delivery records");
        }
      } catch (error) {
        console.error("Error fetching delivery records:", error);
      }
    };

    fetchDeliveryRecords();
  }, []);

  useEffect(() => {
    let filtered = deliveries;

    // Filter by Supplier ID
    if (supplierId) {
      filtered = filtered.filter((d) =>
        d.supplierId.toLowerCase().includes(supplierId.toLowerCase())
      );
    }

    // Date range filter
    if (startDate) {
      filtered = filtered.filter(
        (d) => new Date(d.date) >= new Date(startDate)
      );
    }

    if (endDate) {
      filtered = filtered.filter((d) => new Date(d.date) <= new Date(endDate));
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      showAlert("Start date cannot be after end date.", "error");
      return;
    }

    // Route filter
    if (selectedRoute) {
      filtered = filtered.filter((d) => d.route === selectedRoute);
    }

    setFilteredDeliveries(filtered);
  }, [supplierId, startDate, endDate, selectedRoute, deliveries]);

  const handleClearFilters = () => {
    setSupplierId("");
    setStartDate("");
    setEndDate("");
    setSelectedRoute("");
    setFilteredDeliveries(deliveries);
  };

  const handleSearchChange = (e) => {
    setSupplierId(e.target.value);
  };

  const handleAddDeliveryRecord = () => {
    navigate("/add-new-delivery-record");
  };

  const handleEdit = (deliveryId) => {
    navigate(`/edit-delivery-record/${deliveryId}`);
  };

  const handleDelete = async (deliveryId) => {
    if (
      window.confirm("Are you sure you want to delete this delivery record?")
    ) {
      try {
        const response = await fetch(
          `http://localhost:3001/api/deliveries/${deliveryId}`,
          { method: "DELETE" }
        );

        if (response.ok) {
          const updated = deliveries.filter((d) => d.deliveryId !== deliveryId);
          setDeliveries(updated);
          setFilteredDeliveries(updated);
          alert("Delivery record deleted successfully!");
        } else {
          console.error("Failed to delete delivery record");
        }
      } catch (error) {
        console.error("Error deleting delivery record:", error);
      }
    }
  };

  return (
    <EmployeeLayout>
      <div className="view-delivery-records-container">
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <MuiAlert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{
              width: "100%",
              fontWeight: "bold",
              fontSize: "1rem",
              backgroundColor:
                snackbar.severity === "success"
                  ? "rgb(14, 152, 16)"
                  : snackbar.severity === "error"
                  ? "rgb(211,47,47)"
                  : snackbar.severity === "warning"
                  ? "rgb(237, 201, 72)"
                  : "#1976d2",
              color: "white",
              boxShadow: 3,
            }}
            elevation={6}
            variant="filled"
          >
            {snackbar.message}
          </MuiAlert>
        </Snackbar>
        <div className="content-header">
          <h3>View Delivery Records</h3>

          <button
            className="add-delivery-btn"
            onClick={handleAddDeliveryRecord}
          >
            Add New Delivery Record
          </button>

          {/* Filters */}
          <div className="filter-section">
            <div className="filter-group">
              <div className="search-box">
              <input
                type="text"
                placeholder="Search by Supplier ID"
                value={supplierId}
                onChange={handleSearchChange}
              />
              <BiSearch className="icon" /> </div>
            </div>

            <div className="filter-group">
              <label>Start Date:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>End Date:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Route:</label>
              <select
                value={selectedRoute}
                onChange={(e) => setSelectedRoute(e.target.value)}
              >
                <option value="">All</option>
                {[...new Set(deliveries.map((d) => d.route))].map((route) => (
                  <option key={route} value={route}>
                    {route}
                  </option>
                ))}
              </select>
            </div>
            <button className="clear-filters-btn" onClick={handleClearFilters}>
              Clear Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <table className="deliveries-table">
          <thead>
            <tr>
              <th>Supplier ID</th>
              <th>Date</th>
              <th>Transport</th>
              <th>Route</th>
              <th>Total Weight (kg)</th>
              <th>Total Sack Weight (kg)</th>
              <th>For Water (kg)</th>
              <th>For Withered Leaves (kg)</th>
              <th>For Ripe Leaves (kg)</th>
              <th>Randalu (kg)</th>
              <th>Green Tea Leaves (kg)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeliveries.length > 0 ? (
              filteredDeliveries.map((delivery) => (
                <tr key={delivery.deliveryId}>
                  <td>{delivery.supplierId}</td>
                  <td>{delivery.date}</td>
                  <td>{delivery.transport}</td>
                  <td>{delivery.route}</td>
                  <td>{delivery.totalWeight}</td>
                  <td>{delivery.totalSackWeight}</td>
                  <td>{delivery.forWater}</td>
                  <td>{delivery.forWitheredLeaves}</td>
                  <td>{delivery.forRipeLeaves}</td>
                  <td>{delivery.randalu}</td>
                  <td>{delivery.greenTeaLeaves}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(delivery.deliveryId)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(delivery.deliveryId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12">No delivery records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </EmployeeLayout>
  );
};

export default ViewDeliveryRecords;
