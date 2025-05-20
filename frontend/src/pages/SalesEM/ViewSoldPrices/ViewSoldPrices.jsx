import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmployeeLayout from '../../../components/EmployeeLayout/EmployeeLayout.jsx';
import AdminLayout from '../../../components/AdminLayout/AdminLayout.jsx';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const ViewSoldPrices = () => {
  const [soldLots, setSoldLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchSoldLots = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3001/api/soldLots/all');
        setSoldLots(response.data.data);
      } catch (err) {
        console.error('Error fetching sold lots:', err);
        setError('Failed to load sold lots data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSoldLots();
  }, []);

  const filteredLots = soldLots.filter(lot =>
    lot.lotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lot.teaGrade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lot.brokerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lot.brokerCompanyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(amount);
  };

const userRole = localStorage.getItem('userRole');
const Layout = userRole === 'admin' ? AdminLayout : EmployeeLayout;

  if (loading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
              All Sold Lots
            </Typography>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search lots..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
              }}
              sx={{ width: 300 }}
            />
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {filteredLots.length === 0 ? (
            <Alert severity="info" sx={{ mb: 3 }}>
              {searchTerm ? 'No matching lots found' : 'No sold lots available'}
            </Alert>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ backgroundColor: 'success.main' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Lot #</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Tea Type</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Net Weight (kg)</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Broker</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Company</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Employee Valuation (LKR/kg)</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Sold Price (LKR/kg)</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Total Sold (LKR)</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Date Sold</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredLots
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((lot) => (
                      <TableRow key={lot.saleId} hover>
                        <TableCell>{lot.lotNumber}</TableCell>
                        <TableCell>{lot.teaTypeName}</TableCell>
                        <TableCell>{lot.totalNetWeight}</TableCell>
                        <TableCell>{lot.brokerName}</TableCell>
                        <TableCell>{lot.brokerCompanyName}</TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>
                          {formatCurrency(lot.employeeValuation)}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>
                          {formatCurrency(lot.soldPrice)}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>
                          {formatCurrency(lot.totalSoldPrice)}
                        </TableCell>
                        <TableCell>
                          {new Date(lot.soldDate).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredLots.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  borderTop: '1px solid rgba(224, 224, 224, 1)'
                }}
              />
            </TableContainer>
          )}
        </Paper>
      </Box>
    </Layout>
  );
};

export default ViewSoldPrices;