import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeLayout from "../../../components/EmployeeLayout/EmployeeLayout";
import { 
  Snackbar, 
  Alert, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Box,
  CircularProgress,
  Chip,
  useTheme
} from "@mui/material";
import { 
  Visibility as ViewIcon,
  ListAlt as ValuationsIcon
} from "@mui/icons-material";

const ViewConfirmedLots = () => {
  const theme = useTheme();
  const [confirmedLots, setConfirmedLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLot, setSelectedLot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: "", 
    severity: "success" 
  });
  const [lotDetails, setLotDetails] = useState(null);
  const [lotDetailsLoading, setLotDetailsLoading] = useState(false);
  const [teaTypes, setTeaTypes] = useState([]);
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all necessary data in parallel
        const [confirmedRes, teaTypesRes] = await Promise.all([
          fetch("http://localhost:3001/api/valuations/confirmed"),
          fetch("http://localhost:3001/api/teaTypes")
        ]);

        // Handle confirmed lots response
        const confirmedText = await confirmedRes.text();
        if (!confirmedRes.ok) {
          throw new Error(confirmedText || "Failed to fetch confirmed lots");
        }
        const confirmedData = JSON.parse(confirmedText);

        // Handle tea types response
        const teaTypesText = await teaTypesRes.text();
        if (!teaTypesRes.ok) {
          throw new Error(teaTypesText || "Failed to fetch tea types");
        }
        const teaTypesData = JSON.parse(teaTypesText);

        // For each confirmed lot, fetch additional details
        const enrichedLots = await Promise.all(
          confirmedData.map(async (lot) => {
            try {
              // Fetch lot details to get employee valuation
              const lotRes = await fetch(`http://localhost:3001/api/lots/${lot.lotNumber}`);
              if (!lotRes.ok) throw new Error('Failed to fetch lot details');
              const lotDetails = await lotRes.json();

              // Find tea type name
              const teaType = teaTypesData.find(t => t.teaTypeId === lotDetails.teaTypeId);

              return {
                ...lot,
                teaTypeName: teaType?.teaTypeName || 'Unknown',
                employeeValuationPrice: lotDetails.valuationPrice,
                manufacturingDate: lotDetails.manufacturingDate,
                noOfBags: lotDetails.noOfBags,
                netWeight: lotDetails.netWeight,
                totalNetWeight: lotDetails.totalNetWeight,
                status: lotDetails.status,
                notes: lotDetails.notes
              };
            } catch (error) {
              console.error(`Error enriching lot ${lot.lotNumber}:`, error);
              return {
                ...lot,
                teaTypeName: 'Unknown',
                employeeValuationPrice: null,
                manufacturingDate: null,
                noOfBags: null,
                netWeight: null,
                totalNetWeight: null,
                status: null,
                notes: null
              };
            }
          })
        );

        setConfirmedLots(enrichedLots);
        setTeaTypes(teaTypesData);
        setSnackbar({ open: true, message: "Data loaded successfully!", severity: "success" });
      } catch (error) {
        setError(error.message);
        setSnackbar({ open: true, message: error.message, severity: "error" });
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const viewLotDetails = async (lot) => {
    try {
      setLotDetailsLoading(true);
      setSelectedLot(lot);
      
      // Fetch additional details from the API
      const [lotRes, valuationsRes] = await Promise.all([
        fetch(`http://localhost:3001/api/lots/${lot.lotNumber}`),
        fetch(`http://localhost:3001/api/valuations/lot/${lot.lotNumber}`)
      ]);

      if (!lotRes.ok) throw new Error('Failed to fetch lot details');
      if (!valuationsRes.ok) throw new Error('Failed to fetch valuations');

      const lotDetails = await lotRes.json();
      const valuations = await valuationsRes.json();

      // Find tea type name
      const teaType = teaTypes.find(t => t.teaTypeId === lotDetails.teaTypeId);

      setLotDetails({
        ...lotDetails,
        teaTypeName: teaType?.teaTypeName || 'Unknown',
        valuations: valuations
      });
      setIsModalOpen(true);
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: error.message, 
        severity: "error" 
      });
      console.error("Failed to fetch lot details:", error);
    } finally {
      setLotDetailsLoading(false);
    }
  };

  const viewValuationDetails = (lotNumber) => {
    navigate(`/view-valuations/${lotNumber}`);
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

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
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <EmployeeLayout>
      <Box sx={{ p: 3 }}>
         <Typography variant="h4" component="h1" sx={{ 
          mb: 3, 
          fontWeight: 600,
          color: "#1B5E20", 
        }}>
          Confirmed Lot Valuations
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : confirmedLots.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1">
              No confirmed lot valuations found.
            </Typography>
          </Paper>
        ) : (
          <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: theme.palette.grey[100] }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Lot Number</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Tea Type</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Net Weight (kg)</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>No. of Bags</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Broker</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Company</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Broker Valuation</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Employee Valuation</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Confirmed Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {confirmedLots
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((lot) => (
                      <TableRow key={lot.valuation_id} hover>
                        <TableCell>{lot.lotNumber}</TableCell>
                        <TableCell>
                          {lot.teaTypeName}
                        </TableCell>
                        <TableCell>{lot.totalNetWeight}</TableCell>
                        <TableCell>{lot.noOfBags}</TableCell>
                        <TableCell>{lot.brokerName}</TableCell>
                        <TableCell>{lot.companyName}</TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>
                          {formatCurrency(lot.valuationPrice)}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>
                          {formatCurrency(lot.employeeValuationPrice)}
                        </TableCell>
                        <TableCell>
                          {formatDate(lot.confirmed_at)}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<ViewIcon />}
                              onClick={() => viewLotDetails(lot)}
                              sx={{
                                color:"#1B5E20",
                                borderColor: "#1B5E20",
                              }}
                            >
                              Details
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<ValuationsIcon />}
                              onClick={() => viewValuationDetails(lot.lotNumber)}
                              sx={{
                                bgcolor: theme.palette.success.main,
                                '&:hover': {
                                  bgcolor: theme.palette.success.dark
                                }
                              }}
                            >
                              Valuations
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={confirmedLots.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                borderTop: `1px solid ${theme.palette.divider}`
              }}
            />
          </Paper>
        )}

        {/* Lot Details Dialog */}
        <Dialog 
          open={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2
            }
          }}
        >
        <DialogTitle sx={{ 
          bgcolor:"#1B5E20",
          color: theme.palette.primary.contrastText,
          fontWeight: 600
        }}>
          Lot Details - {selectedLot?.lotNumber}
        </DialogTitle>
          <DialogContent dividers sx={{ p: 3 }}>
            {lotDetailsLoading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : lotDetails ? (
              <Box>
                <Box component="ul" sx={{ 
                  listStyle: 'none',
                  p: 0,
                  mb: 3,
                  '& li': {
                    py: 1,
                    borderBottom: `1px solid ${theme.palette.divider}`
                  }
                }}>
                  <Box component="li" display="flex">
                    <Typography variant="subtitle1" sx={{ minWidth: 200, fontWeight: 600 }}>Tea Type:</Typography>
                    <Typography>{lotDetails.teaTypeName}</Typography>
                  </Box>
                  <Box component="li" display="flex">
                    <Typography variant="subtitle1" sx={{ minWidth: 200, fontWeight: 600 }}>Manufacturing Date:</Typography>
                    <Typography>{formatDate(lotDetails.manufacturingDate)}</Typography>
                  </Box>
                  <Box component="li" display="flex">
                    <Typography variant="subtitle1" sx={{ minWidth: 200, fontWeight: 600 }}>No. of Bags:</Typography>
                    <Typography>{lotDetails.noOfBags}</Typography>
                  </Box>
                  <Box component="li" display="flex">
                    <Typography variant="subtitle1" sx={{ minWidth: 200, fontWeight: 600 }}>Net Weight per Bag:</Typography>
                    <Typography>{lotDetails.netWeight} kg</Typography>
                  </Box>
                  <Box component="li" display="flex">
                    <Typography variant="subtitle1" sx={{ minWidth: 200, fontWeight: 600 }}>Total Net Weight:</Typography>
                    <Typography>{lotDetails.totalNetWeight} kg</Typography>
                  </Box>
                  <Box component="li" display="flex">
                    <Typography variant="subtitle1" sx={{ minWidth: 200, fontWeight: 600 }}>Employee Valuation:</Typography>
                    <Typography sx={{ fontWeight: 500 }}>
                      {formatCurrency(lotDetails.valuationPrice)}
                    </Typography>
                  </Box>
                  <Box component="li" display="flex">
                    <Typography variant="subtitle1" sx={{ minWidth: 200, fontWeight: 600 }}>Status:</Typography>
                    <Typography sx={{ 
                      color: lotDetails.status === 'confirmed' ? 
                        theme.palette.success.main : 
                        theme.palette.text.primary
                    }}>
                      {lotDetails.status || 'N/A'}
                    </Typography>
                  </Box>
                  <Box component="li" display="flex">
                    <Typography variant="subtitle1" sx={{ minWidth: 200, fontWeight: 600 }}>Notes:</Typography>
                    <Typography>{lotDetails.notes || 'None'}</Typography>
                  </Box>
                </Box>

                <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600 }}>
                  Broker Valuations
                </Typography>
                {lotDetails.valuations?.length > 0 ? (
                  <TableContainer component={Paper} elevation={2}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: theme.palette.grey[100] }}>
                          <TableCell sx={{ fontWeight: 600 }}>Broker</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Company</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Valuation</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {lotDetails.valuations.map((valuation) => (
                          <TableRow key={valuation.valuation_id}>
                            <TableCell>{valuation.brokerName}</TableCell>
                            <TableCell>{valuation.companyName}</TableCell>
                            <TableCell sx={{ fontWeight: 500 }}>
                              {formatCurrency(valuation.valuationPrice)}
                            </TableCell>
                            <TableCell>
                              {formatDate(valuation.valuationDate)}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={valuation.is_confirmed ? 'Confirmed' : 'Rejected'}
                                color={valuation.is_confirmed ? 'success' : 'error'}
                                size="small"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No broker valuations found for this lot.
                  </Typography>
                )}
              </Box>
            ) : (
              <Typography color="textSecondary">
                Failed to load lot details
              </Typography>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button 
              variant="contained"
              onClick={() => setIsModalOpen(false)}
              sx={{
                bgcolor: theme.palette.error.main,
                '&:hover': {
                  bgcolor: theme.palette.error.dark
                }
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleSnackbarClose} 
            severity={snackbar.severity} 
            sx={{ 
              width: '100%',
              boxShadow: theme.shadows[3]
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </EmployeeLayout>
  );
};

export default ViewConfirmedLots;