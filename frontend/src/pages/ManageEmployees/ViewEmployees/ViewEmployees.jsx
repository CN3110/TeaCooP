import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import AdminLayout from "../../../components/AdminLayout/AdminLayout";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import "./ViewEmployees.css";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ViewEmployees = () => {
  const [searchId, setSearchId] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openConfirm, setOpenConfirm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate();

  const showAlert = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleOpenDisableConfirm = (employeeId) => {
    setSelectedEmployeeId(employeeId);
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/employees");
        if (response.ok) {
          const data = await response.json();
          setEmployees(data);
          setFilteredEmployees(data);
        } else {
          const errorData = await response.json();
          showAlert(errorData.error || "Failed to fetch employees", "error");
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
        showAlert("An error occurred while fetching employees", "error");
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    let filtered = [...employees];

    if (searchId) {
      filtered = filtered.filter((employee) =>
        employee.employeeId.toLowerCase().includes(searchId.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((employee) => employee.status === statusFilter);
    }

    setFilteredEmployees(filtered);
    setCurrentPage(1); // Reset to page 1 when filters/search change
  }, [searchId, statusFilter, employees]);

  const handleSearchChange = (e) => {
    setSearchId(e.target.value);
  };

  const handleAddEmployee = () => {
    navigate("/add-employee");
  };

  const handleEdit = (employee) => {
    navigate(`/edit-employee/${employee.employeeId}`);
  };

  const handleConfirmDisable = async () => {
    handleCloseConfirm();
    if (!selectedEmployeeId) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/employees/${selectedEmployeeId}/disable`,
        { method: "PUT" }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to disable employee");
      }

      setEmployees((prev) =>
        prev.map((employee) =>
          employee.employeeId === selectedEmployeeId
            ? { ...employee, status: "disabled" }
            : employee
        )
      );

      showAlert("Employee disabled successfully", "success");
    } catch (error) {
      console.error("Error disabling employee:", error);
      showAlert(error.message || "An error occurred while disabling employee", "error");
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <AdminLayout>
      <div className="view-employee-container">
        <div className="content-header">
          <h3>View Employees</h3>
          <div className="header-activity">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by Employee ID"
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
              <button className="add-employee-btn" onClick={handleAddEmployee}>
                Add New Employee
              </button>
            </div>
          </div>
        </div>

        <table className="employees-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Contact Number</th>
              <th>Email</th>
              <th>Status</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentEmployees.length > 0 ? (
              currentEmployees.map((employee) => (
                <tr key={employee.employeeId}>
                  <td>{employee.employeeId}</td>
                  <td>{employee.employeeName}</td>
                  <td>{employee.employeeContact_no}</td>
                  <td>{employee.employeeEmail}</td>
                  <td className={`status-cell status-${employee.status}`}>
                    {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                  </td>
                  <td className="employee-notes">
                    {employee.notes || "No notes available"}
                  </td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(employee)}>
                      Edit
                    </button>
                    {employee.status !== "disabled" && (
                      <button
                        className="disable-button"
                        onClick={() => handleOpenDisableConfirm(employee.employeeId)}
                      >
                        Disable
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-results">
                  No employees found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={`page-btn ${currentPage === index + 1 ? "active" : ""}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}

        {/* Confirmation Dialog */}
        <Dialog
          open={openConfirm}
          onClose={handleCloseConfirm}
          PaperProps={{
            style: {
              borderRadius: "12px",
              padding: "20px",
              minWidth: "400px",
            },
          }}
        >
          <DialogTitle sx={{ fontSize: "1.2rem", fontWeight: 600 }}>
            Confirm Disable Employee
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ fontSize: "1rem" }}>
              Are you sure you want to disable this employee?
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ padding: "16px 24px" }}>
            <Button
              onClick={handleCloseConfirm}
              variant="outlined"
              sx={{ textTransform: "none", padding: "6px 16px", borderRadius: "8px" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDisable}
              color="error"
              variant="contained"
              sx={{ textTransform: "none", padding: "6px 16px", borderRadius: "8px" }}
            >
              Confirm Disable
            </Button>
          </DialogActions>
        </Dialog>

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
    </AdminLayout>
  );
};

export default ViewEmployees;
