import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Snackbar,
  Alert,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "./TeaProductionList.css";

const TeaProductionList = () => {
  const navigate = useNavigate();
  const [productions, setProductions] = useState([]);
  const [allProductions, setAllProductions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalProduction, setTotalProduction] = useState(0);
  const [totalPeriod, setTotalPeriod] = useState("currentMonth");
  const [currentMonthName, setCurrentMonthName] = useState("");
  const [allocatedForPackets, setAllocatedForPackets] = useState(null);
  const [allocatedForTeaType, setAllocatedForTeaType] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  });
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProductionId, setSelectedProductionId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Edit functionality
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    productionId: null,
    productionDate: "",
    weightInKg: "",
    rawTeaUsed: "",
    employeeName: "",
  });
  const [editFormErrors, setEditFormErrors] = useState({
    productionDate: "",
    weightInKg: "",
    rawTeaUsed: "",
    employeeName: "",
  });

  // Reference to the total production value element for highlight animation
  const totalValueRef = useRef(null);
  const prevTotalRef = useRef(totalProduction);

  useEffect(() => {
    fetch("http://localhost:3001/api/tea-packets/available")
      .then((res) => res.json())
      .then((data) => {
        setAllocatedForPackets(data.allocatedForPackets);
      })
      .catch((err) => console.error("Error fetching packet data:", err));

    // Fetch Allocated for Tea Type Categorization
    fetch(
      "http://localhost:3001/api/lots/made-tea-available-for-teaType-creation"
    )
      .then((res) => res.json())
      .then((data) => {
        setAllocatedForTeaType(data.availableWeight);
      })
      .catch((err) =>
        console.error("Error fetching categorization data:", err)
      );

    const today = new Date();
    setCurrentMonthName(format(today, "MMMM yyyy"));

    const fetchData = async () => {
      try {
        setLoading(true);
        const productionsResponse = await axios.get(
          "http://localhost:3001/api/teaProductions?limit=1000&page=1"
        );
        setAllProductions(productionsResponse.data.productions || []);
        setProductions(productionsResponse.data.productions || []);
        updatePagination(productionsResponse.data.productions || []);
        setError("");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load data");
        showSnackbar("Failed to load production records", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchTotalProduction = async () => {
      try {
        const params = {};
        if (filters.startDate) params.startDate = filters.startDate;
        if (filters.endDate) params.endDate = filters.endDate;

        const response = await axios.get(
          "http://localhost:3001/api/teaProductions/total",
          { params }
        );
        setTotalProduction(Number(response.data.totalProduction) || 0);
        setTotalPeriod(response.data.period || "currentMonth");
      } catch (err) {
        showSnackbar("Failed to fetch total production", "error");
        setTotalProduction(0);
      }
    };
    fetchTotalProduction();
  }, [filters]);

  // Add animation when total production changes
  useEffect(() => {
    if (prevTotalRef.current !== totalProduction && totalValueRef.current) {
      totalValueRef.current.classList.remove("highlight");
      // Force DOM reflow
      void totalValueRef.current.offsetWidth;
      totalValueRef.current.classList.add("highlight");
      prevTotalRef.current = totalProduction;
    }
  }, [totalProduction]);

  useEffect(() => {
    if (allProductions.length === 0) return;
    let filtered = [...allProductions];

    if (filters.startDate) {
      const start = new Date(filters.startDate);
      filtered = filtered.filter((p) => new Date(p.productionDate) >= start);
    }
    if (filters.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter((p) => new Date(p.productionDate) <= end);
    }

    if (filters.startDate && filters.endDate) {
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);
      if (start > end) {
        showSnackbar("End date cannot be before start date", "error");
        return;
      }
      if (end > new Date()) {
        showSnackbar("Future dates are not allowed", "error");
        return;
      }
    }

    setProductions(filtered);
    updatePagination(filtered);
  }, [filters, allProductions]);

  // Function to handle the click event for the "Allocate for Tea Packet" button
  const handlePacketAllocationClick = () => {
    navigate("/tea-packet");
  };

  //fuction to handle the click event for the "Allocate for Tea Type Categorization" button
  const handleTeaTypeAllocationClick = () => {
    navigate("/tea-type-stock-management");
  };

  const updatePagination = (data) => {
    setPagination({
      total: data.length,
      page: 1,
      limit: 10,
      pages: Math.ceil(data.length / 10),
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.pages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const handleDeleteClick = (productionId) => {
    setSelectedProductionId(productionId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(
        `http://localhost:3001/api/teaProductions/${selectedProductionId}`
      );
      const updatedProductions = allProductions.filter(
        (p) => p.productionId !== selectedProductionId
      );
      setAllProductions(updatedProductions);
      setProductions(updatedProductions);
      updatePagination(updatedProductions);
      showSnackbar("Production record deleted successfully", "success");

      // Fetch updated total after deletion
      const params = {};
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      const response = await axios.get(
        "http://localhost:3001/api/teaProductions/total",
        { params }
      );
      setTotalProduction(Number(response.data.totalProduction) || 0);
    } catch (err) {
      showSnackbar(
        err.response?.data?.message || "Failed to delete record",
        "error"
      );
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  // Edit functions
  const handleEditClick = (production) => {
    // Format date to YYYY-MM-DD for input type="date"
    const formattedDate = production.productionDate
      ? format(parseISO(production.productionDate), "yyyy-MM-dd")
      : "";

    setEditFormData({
      productionId: production.productionId,
      productionDate: formattedDate,
      weightInKg: production.weightInKg
        ? parseFloat(production.weightInKg).toString()
        : "",
      rawTeaUsed: production.rawTeaUsed
        ? parseFloat(production.rawTeaUsed).toString()
        : "",
      employeeName: production.employeeName || production.createdBy || "",
    });
    setEditFormErrors({
      productionDate: "",
      weightInKg: "",
      rawTeaUsed: "",
      employeeName: "",
    });
    setEditDialogOpen(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));

    // Clear the error when user types
    if (editFormErrors[name]) {
      setEditFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateEditForm = () => {
    let valid = true;
    const newErrors = { ...editFormErrors };

    if (!editFormData.productionDate) {
      newErrors.productionDate = "Production date is required";
      valid = false;
    } else {
      const selectedDate = new Date(editFormData.productionDate);
      const today = new Date();
      if (selectedDate > today) {
        newErrors.productionDate = "Future dates are not allowed";
        valid = false;
      }
    }

    if (!editFormData.weightInKg) {
      newErrors.weightInKg = "Weight is required";
      valid = false;
    } else if (
      isNaN(Number(editFormData.weightInKg)) ||
      Number(editFormData.weightInKg) <= 0
    ) {
      newErrors.weightInKg = "Weight must be a positive number";
      valid = false;
    }

    if (!editFormData.rawTeaUsed) {
      newErrors.rawTeaUsed = "Raw tea used is required";
      valid = false;
    } else if (
      isNaN(Number(editFormData.rawTeaUsed)) ||
      Number(editFormData.rawTeaUsed) <= 0
    ) {
      newErrors.rawTeaUsed = "Raw tea used must be a positive number";
      valid = false;
    }

    if (!editFormData.employeeName) {
      newErrors.employeeName = "Employee name is required";
      valid = false;
    }

    setEditFormErrors(newErrors);
    return valid;
  };

  const handleEditSave = async () => {
    if (!validateEditForm()) return;

    try {
      await axios.put(
        `http://localhost:3001/api/teaProductions/${editFormData.productionId}`,
        {
          productionDate: editFormData.productionDate,
          weightInKg: parseFloat(editFormData.weightInKg),
          rawTeaUsed: parseFloat(editFormData.rawTeaUsed),
          employeeName: editFormData.employeeName,
        }
      );

      // Update local state
      const updatedProductions = allProductions.map((p) =>
        p.productionId === editFormData.productionId
          ? {
              ...p,
              productionDate: editFormData.productionDate,
              weightInKg: parseFloat(editFormData.weightInKg),
              rawTeaUsed: parseFloat(editFormData.rawTeaUsed),
              employeeName: editFormData.employeeName,
            }
          : p
      );

      setAllProductions(updatedProductions);
      setProductions(updatedProductions);
      showSnackbar("Production record updated successfully", "success");

      // Refresh total production
      const params = {};
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      const response = await axios.get(
        "http://localhost:3001/api/teaProductions/total",
        { params }
      );
      setTotalProduction(Number(response.data.totalProduction) || 0);

      setEditDialogOpen(false);
    } catch (err) {
      showSnackbar(
        err.response?.data?.message || "Failed to update record",
        "error"
      );
    }
  };

  const resetFilters = () => {
    setFilters({ startDate: "", endDate: "" });
  };

  const showSnackbar = (message, severity = "success") => {
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

  const paginatedData = productions.slice(
    (pagination.page - 1) * pagination.limit,
    pagination.page * pagination.limit
  );

  // Generate the appropriate total display text
  const getTotalDisplayText = () => {
    if (loading) return "Loading...";

    const formattedTotal = `${Number(totalProduction).toFixed(2)} kg`;

    if (totalPeriod === "filtered" && (filters.startDate || filters.endDate)) {
      let periodText = "for selected period";
      if (filters.startDate && filters.endDate) {
        periodText = `from ${format(
          parseISO(filters.startDate),
          "dd/MM/yyyy"
        )} to ${format(parseISO(filters.endDate), "dd/MM/yyyy")}`;
      } else if (filters.startDate) {
        periodText = `from ${format(
          parseISO(filters.startDate),
          "dd/MM/yyyy"
        )}`;
      } else if (filters.endDate) {
        periodText = `until ${format(parseISO(filters.endDate), "dd/MM/yyyy")}`;
      }
      return `${formattedTotal} ${periodText}`;
    }

    // For current month - use the stored month name
    return `${formattedTotal} for ${currentMonthName}`;
  };

  if (loading && productions.length === 0) {
    return <div className="loading">Loading production records...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="tea-production-list">
      <h2>Tea Production Records</h2>

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <label>From Date:</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            max={format(new Date(), "yyyy-MM-dd")}
          />
        </div>
        <div className="filter-group">
          <label>To Date:</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            min={filters.startDate}
            max={format(new Date(), "yyyy-MM-dd")}
          />
        </div>
        <button onClick={resetFilters} className="reset-btn">
          Reset Filters
        </button>
      </div>

      <div className="total-production-label">
        <span>Total Production:</span>
        <span className="total-production-value" ref={totalValueRef}>
          {getTotalDisplayText()}
        </span>
      </div>

      <div className="cards">
<Card
  sx={{
    maxWidth: 300,
    cursor: "pointer",
    backgroundColor: "#f0f4ff",
    marginBottom: 2,
  }}
>
  <CardActionArea onClick={handlePacketAllocationClick}>
    <CardContent>
      <Typography variant="h6" color="primary">
        Allocated for Tea Packets:{" "}
        {allocatedForPackets != null ? allocatedForPackets.toFixed(2) : "Loading..."} kg
      </Typography>
    </CardContent>
  </CardActionArea>
</Card>

<Card sx={{ maxWidth: 300, cursor: "pointer", backgroundColor: "#f9f9f9" }}>
  <CardActionArea onClick={handleTeaTypeAllocationClick}>
    <CardContent>
      <Typography variant="h6" color="secondary">
        Allocated for Tea Type Categorization:{" "}
        {allocatedForTeaType != null ? allocatedForTeaType.toFixed(2) : "Loading..."} kg
      </Typography>
    </CardContent>
  </CardActionArea>
</Card>

      </div>
      {/* Table */}
      <div className="table-container">
        <table className="production-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Raw Tea Used (kg)</th>
              <th>Production (kg)</th>
              <th>Recorded By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((production) => {
                const productionDate = production.productionDate
                  ? format(parseISO(production.productionDate), "dd/MM/yyyy")
                  : "N/A";
                const weight = production.weightInKg
                  ? parseFloat(production.weightInKg).toFixed(2)
                  : "0.00";
                const rawTeaUsed = production.rawTeaUsed
                  ? parseFloat(production.rawTeaUsed).toFixed(2)
                  : "0.00";
                return (
                  <tr key={production.productionId}>
                    <td>{productionDate}</td>
                    <td>{rawTeaUsed}</td>
                    <td>{weight}</td>
                    <td>{production.employeeName || production.createdBy}</td>
                    <td>
                      <IconButton
                        onClick={() => handleEditClick(production)}
                        color="primary"
                        aria-label="edit"
                        size="small"
                      >
                        <EditIcon
                          fontSize="small"
                          style={{ color: "rgb(33, 101, 33)" }}
                        />
                      </IconButton>
                      <IconButton
                        onClick={() =>
                          handleDeleteClick(production.productionId)
                        }
                        color="error"
                        aria-label="delete"
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="no-records">
                <td colSpan="5" className="no-records-text">
                  No production records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
        >
          Previous
        </button>
        <span>
          Page {pagination.page} of {pagination.pages}
        </span>
        <button
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page === pagination.pages}
        >
          Next
        </button>
      </div>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          style: { borderRadius: "12px", padding: "20px", minWidth: "400px" },
        }}
      >
        <DialogTitle sx={{ fontSize: "1.2rem", fontWeight: 600 }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: "1rem" }}>
            Are you sure you want to delete this production record?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        PaperProps={{
          style: { borderRadius: "12px", padding: "20px", minWidth: "500px" },
        }}
      >
        <DialogTitle sx={{ fontSize: "1.2rem", fontWeight: 600 }}>
          Edit Production Record
        </DialogTitle>
        <DialogContent>
          <div className="edit-form">
            <div className="form-group">
              <label htmlFor="productionDate">Production Date *</label>
              <input
                type="date"
                id="productionDate"
                name="productionDate"
                value={editFormData.productionDate}
                onChange={handleEditFormChange}
                max={format(new Date(), "yyyy-MM-dd")}
                className={editFormErrors.productionDate ? "error" : ""}
              />
              {editFormErrors.productionDate && (
                <div className="error-message">
                  {editFormErrors.productionDate}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="rawTeaUsed">Raw Tea Used (kg) *</label>
              <input
                type="number"
                id="rawTeaUsed"
                name="rawTeaUsed"
                value={editFormData.rawTeaUsed}
                onChange={handleEditFormChange}
                step="0.01"
                min="0.01"
                className={editFormErrors.rawTeaUsed ? "error" : ""}
              />
              {editFormErrors.rawTeaUsed && (
                <div className="error-message">{editFormErrors.rawTeaUsed}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="weightInKg">Production Weight (kg) *</label>
              <input
                type="number"
                id="weightInKg"
                name="weightInKg"
                value={editFormData.weightInKg}
                onChange={handleEditFormChange}
                step="0.01"
                min="0.01"
                className={editFormErrors.weightInKg ? "error" : ""}
              />
              {editFormErrors.weightInKg && (
                <div className="error-message">{editFormErrors.weightInKg}</div>
              )}
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button onClick={() => setEditDialogOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleEditSave} color="primary" variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default TeaProductionList;
