import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Box,
  Typography,
  Chip,
  Tooltip
} from "@mui/material";
import {
  Search,
  Add,
  Edit,
  Delete,
  Visibility,
  NavigateBefore,
  NavigateNext
} from "@mui/icons-material";
import EmployeeLayout from "../../../components/EmployeeLayout/EmployeeLayout";
import { styled } from "@mui/material/styles";

const DarkGreenButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.success.dark,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.success.main,
  },
}));

const ViewLots = () => {
  const [lots, setLots] = useState([]);
  const [teaTypes, setTeaTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: "", 
    severity: "success" 
  });
  const [confirmDialog, setConfirmDialog] = useState({ 
    open: false, 
    lotNumber: null 
  });

  const lotsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lotsResponse, teaTypesResponse] = await Promise.all([
          fetch("http://localhost:3001/api/lots"),
          fetch("http://localhost:3001/api/teaTypes")
        ]);

        if (!lotsResponse.ok || !teaTypesResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const [lotsData, teaTypesData] = await Promise.all([
          lotsResponse.json(),
          teaTypesResponse.json()
        ]);

        setLots(lotsData);
        setTeaTypes(teaTypesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setSnackbar({ 
          open: true, 
          message: "Failed to load data.", 
          severity: "error" 
        });
      }
    };

    fetchData();
  }, []);

  const getTeaTypeName = (teaTypeId) => {
    const teaType = teaTypes.find((type) => type.teaTypeId === teaTypeId);
    return teaType ? teaType.teaTypeName : "Unknown";
  };

  const handleEdit = (lotNumber) => {
    navigate(`/edit-lot/${lotNumber}`);
  };

  const confirmDeleteLot = (lotNumber) => {
    setConfirmDialog({ open: true, lotNumber });
  };

  const handleDeleteConfirmed = async () => {
    const { lotNumber } = confirmDialog;
    setConfirmDialog({ open: false, lotNumber: null });

    try {
      const response = await fetch(`http://localhost:3001/api/lots/${lotNumber}`, {
        method: "DELETE"
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to delete lot");

      setLots((prev) => prev.filter((lot) => lot.lotNumber !== lotNumber));
      setSnackbar({ 
        open: true, 
        message: "Lot deleted successfully", 
        severity: "success" 
      });
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredLots = lots.filter((lot) =>
    lot.lotNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastLot = currentPage * lotsPerPage;
  const indexOfFirstLot = indexOfLastLot - lotsPerPage;
  const currentLots = filteredLots.slice(indexOfFirstLot, indexOfLastLot);
  const totalPages = Math.ceil(filteredLots.length / lotsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <EmployeeLayout>
      <Box sx={{ p: 3 }}>
        {/* Header Section */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3 
        }}>
          <Typography variant="h4" component="h1" color="success.dark">
            Lot Management
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search by Lot Number"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 300 }}
            />
            
            <DarkGreenButton
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate("/employee-dashboard-create-lot")}
            >
              Add New Lot
            </DarkGreenButton>
          </Box>
        </Box>

        {/* Lots Table */}
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead sx={{ backgroundColor: 'success.dark' }}>
              <TableRow>
                <TableCell sx={{ color: 'common.dark' }}>Lot Number</TableCell>
                <TableCell sx={{ color: 'common.dark' }}>Manufacturing Date</TableCell>
                <TableCell sx={{ color: 'common.dark' }}>Tea Type</TableCell>
                <TableCell sx={{ color: 'common.dark' }} align="right">No. of Bags</TableCell>
                <TableCell sx={{ color: 'common.dark' }} align="right">Net Weight (kg)</TableCell>
                <TableCell sx={{ color: 'common.dark' }} align="right">Total Net Weight (kg)</TableCell>
                <TableCell sx={{ color: 'common.dark' }} align="right">Valuation Price (LKR)</TableCell>
                <TableCell sx={{ color: 'common.dark' }}>Notes</TableCell>
                <TableCell sx={{ color: 'common.dark' }}>Status</TableCell>
                <TableCell sx={{ color: 'common.dark' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentLots.length > 0 ? (
                currentLots.map((lot) => (
                  <TableRow key={lot.lotNumber} hover>
                    <TableCell>{lot.lotNumber}</TableCell>
                    <TableCell>
                      {new Date(lot.manufacturingDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{getTeaTypeName(lot.teaTypeId)}</TableCell>
                    <TableCell align="right">{lot.noOfBags}</TableCell>
                    <TableCell align="right">{lot.netWeight}</TableCell>
                    <TableCell align="right">{lot.totalNetWeight}</TableCell>
                    <TableCell align="right">{lot.valuationPrice}</TableCell>
                    <TableCell>
                      <Tooltip title={lot.notes || 'No notes'}>
                        <Typography 
                          sx={{ 
                            maxWidth: 150, 
                            whiteSpace: 'nowrap', 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis' 
                          }}
                        >
                          {lot.notes || '-'}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={lot.status} 
                        color={getStatusColor(lot.status)} 
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit">
                          <IconButton 
                            color="primary" 
                            onClick={() => handleEdit(lot.lotNumber)}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton 
                            color="error" 
                            onClick={() => confirmDeleteLot(lot.lotNumber)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View Valuations">
                          <IconButton 
                            color="success"
                            onClick={() => navigate(`/view-valuations/${lot.lotNumber}`)}
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    {searchTerm ? "No matching lots found" : "No lots available"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mt: 3,
          '& .MuiPaginationItem-root.Mui-selected': {
            backgroundColor: 'success.dark',
            color: 'common.white',
            '&:hover': {
              backgroundColor: 'success.main',
            }
          }
        }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
            siblingCount={1}
            boundaryCount={1}
          />
        </Box>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={confirmDialog.open} 
        onClose={() => setConfirmDialog({ open: false, lotNumber: null })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete lot {confirmDialog.lotNumber}?
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setConfirmDialog({ open: false, lotNumber: null })}
            color="inherit"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirmed}
            color="error"
            variant="contained"
          >
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
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </EmployeeLayout>
  );
};

export default ViewLots;