import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeLayout from "../../components/EmployeeLayout/EmployeeLayout";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  MenuItem,
  IconButton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  Card,
  TablePagination,
  InputAdornment,
  Grid,
  Stack
} from "@mui/material";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Block as DeleteIcon,
  Add as AddIcon
} from "@mui/icons-material";
import "./ViewSuppliers.css"; // Import the CSS file

const ITEMS_PER_PAGE = 5;

const ViewSuppliers = () => {
  const [searchId, setSearchId] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [openConfirm, setOpenConfirm] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(ITEMS_PER_PAGE);

  const navigate = useNavigate();

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

  const handleOpenDisableConfirm = (supplierId) => {
    setSelectedSupplierId(supplierId);
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/suppliers");
        if (response.ok) {
          const data = await response.json();
          setSuppliers(data);
          setFilteredSuppliers(data);
        } else {
          const errorData = await response.json();
          showAlert(errorData.error || "Failed to fetch suppliers", "error");
        }
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        showAlert("An error occurred while fetching suppliers", "error");
      }
    };
    fetchSuppliers();
  }, []);

  useEffect(() => {
    let filtered = [...suppliers];

    if (searchId) {
      filtered = filtered.filter((supplier) =>
        supplier.supplierId.toLowerCase().includes(searchId.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (supplier) => supplier.status === statusFilter
      );
    }

    setFilteredSuppliers(filtered);
    setPage(0); // Reset to first page on filter/search change
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

  const handleConfirmDisable = async () => {
    handleCloseConfirm();
    if (!selectedSupplierId) return;

    try {
      const response = await fetch(
        `http://localhost:3001/api/suppliers/${selectedSupplierId}/disable`,
        { method: "PUT" }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to disable supplier");
      }

      setSuppliers((prevSuppliers) =>
        prevSuppliers.map((supplier) =>
          supplier.supplierId === selectedSupplierId
            ? { ...supplier, status: "disabled" }
            : supplier
        )
      );

      showAlert("Supplier disabled successfully", "success");
    } catch (error) {
      console.error("Error disabling supplier:", error);
      showAlert(
        error.message || "An error occurred while disabling supplier",
        "error"
      );
    }
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Get paginated data
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredSuppliers.length) : 0;
  const paginatedSuppliers = filteredSuppliers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <EmployeeLayout>
      <div className="view-supplier-container">
        <Card className="supplier-card">
          <Box className="content-header">
            <Typography variant="h5" component="h1" className="page-title">
              View Suppliers
            </Typography>
            
            <Stack 
              direction={{ xs: "column", sm: "row" }} 
              spacing={2} 
              className="header-controls"
            >
              <TextField
                placeholder="Search by Supplier ID"
                value={searchId}
                onChange={handleSearchChange}
                size="small"
                className="search-field"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                size="small"
                label="Status"
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="disabled">Disabled</MenuItem>
              </TextField>
              
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddSupplier}
              >
                Add New Supplier
              </Button>
            </Stack>
          </Box>

          <TableContainer component={Paper} className="suppliers-table-container">
            <Table className="suppliers-table">
              <TableHead>
                <TableRow>
                  <TableCell>Supplier ID</TableCell>
                  <TableCell>Supplier Name</TableCell>
                  <TableCell>Contact Number</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell className="land-details-column">Land Details</TableCell>
                  <TableCell className="notes-column">Notes</TableCell>
                  <TableCell>Actions</TableCell>
                  <TableCell>Added by</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedSuppliers.length > 0 ? (
                  paginatedSuppliers.map((supplier) => (
                    <TableRow 
                      key={supplier.supplierId}
                      hover
                    >
                      <TableCell>{supplier.supplierId}</TableCell>
                      <TableCell>{supplier.supplierName}</TableCell>
                      <TableCell>{supplier.supplierContactNumber}</TableCell>
                      <TableCell>{supplier.supplierEmail}</TableCell>
                      <TableCell>
                        <Chip 
                          label={supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}
                          color={supplier.status === 'active' ? 'success' : supplier.status === 'pending' ? 'warning' : 'error'}
                          size="small"
                          className={`status-chip ${supplier.status}`}
                        />
                      </TableCell>
                      <TableCell className="land-details-column">
                        {supplier.landDetails && supplier.landDetails.length > 0 ? (
                          <div>
                            {supplier.landDetails.map((land, index) => (
                              <div key={index} className="land-detail-card">
                                <div className="land-detail-title">
                                  Land {index + 1}
                                </div>
                                <div className="land-detail-info">
                                  <div>
                                    <span className="land-detail-label">Size:</span>{" "}
                                    <span className="land-detail-value">{land.landSize} acres</span>
                                  </div>
                                  <div className="land-detail-address">
                                    <span className="land-detail-label">Address:</span>{" "}
                                    <span className="land-detail-value">{land.landAddress}</span>
                                  </div>
                                  {land.delivery_routeName && (
                                    <div>
                                      <span className="land-detail-label">Route:</span>{" "}
                                      <span className="land-detail-value">{land.delivery_routeName}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <Typography className="no-data-text">
                            No land details available
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell className="notes-column">
                        <div className="supplier-notes">
                          {supplier.notes || (
                            <span className="no-data-text">No notes available</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleEdit(supplier)}
                          color="primary"
                          size="small"
                          className="action-button edit-button"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>

                        {supplier.status !== "disabled" && (
                          <IconButton
                            onClick={() => handleOpenDisableConfirm(supplier.supplierId)}
                            color="error"
                            size="small"
                            className="action-button disable-button"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="employee-id">
                          {supplier.addedByEmployeeId}
                        </div>
                        {supplier.employeeName && (
                          <div className="employee-name">
                            ({supplier.employeeName})
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="empty-state">
                      No suppliers found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={9} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredSuppliers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            className="pagination-controls"
          />
        </Card>

        {/* Confirmation Dialog */}
        <Dialog
          open={openConfirm}
          onClose={handleCloseConfirm}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" className="confirm-dialog-title">
            Confirm Disable Supplier
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to disable this supplier? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions className="confirm-dialog-actions">
            <Button onClick={handleCloseConfirm} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmDisable} color="error" variant="contained">
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
            variant="filled"
            elevation={6}
            className="alert-snackbar"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </EmployeeLayout>
  );
};

export default ViewSuppliers;