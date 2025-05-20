import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import {
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Tooltip
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import EmployeeLayout from "../../../components/EmployeeLayout/EmployeeLayout";
import "./ViewTeaTypes.css";

const ViewTeaTypes = () => {
  const [searchId, setSearchId] = useState("");
  const [teaTypes, setTeaTypes] = useState([]);
  const [filteredTeaTypes, setFilteredTeaTypes] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTeaTypeId, setSelectedTeaTypeId] = useState(null);
  const [selectedTeaTypeName, setSelectedTeaTypeName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeaTypes = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/teaTypes");
        if (response.ok) {
          const data = await response.json();
          setTeaTypes(data);
          setFilteredTeaTypes(data);
        } else {
          throw new Error("Failed to fetch tea types");
        }
      } catch (error) {
        setSnackbar({ open: true, message: error.message, severity: "error" });
      }
    };

    fetchTeaTypes();
  }, []);

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setSearchId(searchTerm);
    const filtered = teaTypes.filter((teaType) =>
      teaType.teaTypeName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTeaTypes(filtered);
  };

  const handleAddTeaType = () => {
    navigate("/add-tea-type");
  };

  const handleEdit = (teaType) => {
    navigate(`/edit-tea-type/${teaType.teaTypeId}`);
  };

  const handleOpenDialog = (teaTypeId, teaTypeName) => {
    setSelectedTeaTypeId(teaTypeId);
    setSelectedTeaTypeName(teaTypeName);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTeaTypeId(null);
    setSelectedTeaTypeName("");
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/teaTypes/${selectedTeaTypeId}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        const updated = teaTypes.filter((t) => t.teaTypeId !== selectedTeaTypeId);
        setTeaTypes(updated);
        setFilteredTeaTypes(updated);
        setSnackbar({ open: true, message: "Tea type deleted successfully", severity: "success" });
      } else {
        throw new Error("Failed to delete tea type");
      }
    } catch (error) {
      setSnackbar({ open: true, message: error.message, severity: "error" });
    } finally {
      handleCloseDialog();
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <EmployeeLayout>
      <div className="view-tea-types-container">
        <div className="content-header">
          <h3>View Tea Types</h3>
          <div className="header-activity">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by Tea Type"
                value={searchId}
                onChange={handleSearchChange}
              />
              <BiSearch className="icon" />
            </div>
            <button className="add-tea-type-btn" onClick={handleAddTeaType}>
              Add Tea Type
            </button>
          </div>
        </div>
        <table className="tea-types-table">
          <thead>
            <tr>
              <th>Tea Type Name</th>
              <th>Tea Type Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeaTypes.map((teaType) => (
              <tr key={teaType.teaTypeId}>
                <td>{teaType.teaTypeName}</td>
                <td>{teaType.teaTypeDescription}</td>
                <td>
                  <Tooltip title="Edit" arrow>
                    <IconButton color="primary" onClick={() => handleEdit(teaType)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete" arrow>
                    <IconButton color="error" onClick={() => handleOpenDialog(teaType.teaTypeId, teaType.teaTypeName)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Snackbar Alert */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the tea type{" "}
            <strong>{selectedTeaTypeName}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </EmployeeLayout>
  );
};

export default ViewTeaTypes;
