import React, { useEffect, useState } from 'react';
import { 
  TextField, 
  Button, 
  Snackbar, 
  TablePagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import './RawTeaRecords.css';
import EmployeeLayout from '../../components/EmployeeLayout/EmployeeLayout';
import AdminLayout from '../../components/AdminLayout/AdminLayout';

const RawTeaRecords = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [totalRawTea, setTotalRawTea] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch all deliveries initially
  const fetchRecords = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/deliveries');
      
      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`);
      }

      const data = await res.json();
      setDeliveries(data);
      setFilteredDeliveries(data); // Initialize filtered deliveries with all data
      
      // Calculate initial total
      updateTotalRawTea(data);
    } catch (err) {
      console.error('Error fetching delivery records:', err.message);
      setDeliveries([]);
      setFilteredDeliveries([]);
      setTotalRawTea(0);
      showAlert("Failed to fetch delivery records", "error");
    }
  };

  // Show alert message
  const showAlert = (message, severity = "info") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // Close alert
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  // Calculate total raw tea weight
  const updateTotalRawTea = (deliveries) => {
    const rawTeaTotal = deliveries.reduce((sum, record) => {
      const greenTea = parseFloat(record.greenTeaLeaves || 0);
      const randalu = parseFloat(record.randalu || 0);
      return sum + greenTea + randalu;
    }, 0);
    setTotalRawTea(rawTeaTotal.toFixed(2));
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = [...deliveries];
    
    // Date range filter
    if (startDate) {
      filtered = filtered.filter(
        (d) => new Date(d.date) >= new Date(startDate)
      );
    }

    if (endDate) {
      // Include the entire end date by setting to end of day
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      filtered = filtered.filter((d) => new Date(d.date) <= endOfDay);
    }

    // Validate date range
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      showAlert("Start date cannot be after end date.", "error");
      return;
    }

    setFilteredDeliveries(filtered);
    updateTotalRawTea(filtered);
    setPage(0); // Reset to first page when filters change
  };

  const handleFilter = () => {
    applyFilters();
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setFilteredDeliveries(deliveries);
    updateTotalRawTea(deliveries);
    setPage(0); // Reset to first page when resetting filters
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate raw tea weight for a single record
  const calculateRawTeaWeight = (delivery) => {
    const greenTea = parseFloat(delivery.greenTeaLeaves || 0);
    const randalu = parseFloat(delivery.randalu || 0);
    return (greenTea + randalu).toFixed(2);
  };

  
const userRole = localStorage.getItem('userRole');
const Layout = userRole === 'admin' ? AdminLayout : EmployeeLayout;

  return (
    <Layout>
    <div className="raw-tea-records-container">
      <h2>Raw Tea Records</h2>

      <div className="filter-section">
        <TextField
          type="date"
          label="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          margin="normal"
          sx={{ mr: 2 }}
        />
        <TextField
          type="date"
          label="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          margin="normal"
          sx={{ mr: 2 }}
        />
        <Button 
          variant="contained" 
          onClick={handleFilter} 
          color='#1a3e1a'
          style={{ marginTop: '16px', marginRight: '8px' }}
        >
          Filter
        </Button>
        <Button 
          variant="outlined" 
          onClick={handleReset} 
          style={{ marginTop: '16px' }}
        >
          Reset
        </Button>
      </div>

      <div className="total-section">
        <h3>Total Raw Tea Collected: {totalRawTea} kg</h3>
      </div>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Delivery ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Raw Tea Weight (kg)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDeliveries.length > 0 ? (
              filteredDeliveries
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((delivery) => (
                  <TableRow key={delivery.deliveryId}>
                    <TableCell>{delivery.deliveryId}</TableCell>
                    <TableCell>{formatDate(delivery.date)}</TableCell>
                    <TableCell>{calculateRawTeaWeight(delivery)}</TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No delivery records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredDeliveries.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

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
    </div>
    </Layout>
  );
};

export default RawTeaRecords;