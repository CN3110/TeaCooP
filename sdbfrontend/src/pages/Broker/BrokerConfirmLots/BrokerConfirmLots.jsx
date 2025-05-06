import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  CircularProgress,
  Box,
  Alert,
  Chip
} from '@mui/material';
import { format } from 'date-fns';
import BrokerLayout from '../../../components/broker/BrokerLayout/BrokerLayout';

const BrokerConfirmLots = () => {
  const [confirmedLots, setConfirmedLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const brokerId = localStorage.getItem('userId'); 
  useEffect(() => {
    const fetchConfirmedLots = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`http://localhost:3001/api/valuations/broker/${brokerId}/confirmed`);
        
        setConfirmedLots(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching confirmed lots:', err);
        setError('Failed to load confirmed lots. Please try again later.');
        setLoading(false);
      }
    };
    
    if (brokerId) {
      fetchConfirmedLots();
    }
  }, [brokerId]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid Date';
    }
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box mt={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }
  
  if (confirmedLots.length === 0) {
    return (
      <Box mt={3}>
        <Alert severity="info">You don't have any confirmed lot valuations yet.</Alert>
      </Box>
    );
  }
  
  return (
    <BrokerLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom component="div">
          Your Confirmed Lot Valuations
        </Typography>
        
        <Typography variant="body1" paragraph>
          These are your valuations that have been confirmed by the MK Tea CooP employees.
        </Typography>
        
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>Lot Number</TableCell>
                <TableCell>Tea Grade</TableCell>
                <TableCell>Bags</TableCell>
                <TableCell>Net Weight (kg)</TableCell>
                <TableCell>Valuation Amount LKR per kg</TableCell>
                <TableCell>Valuation Date</TableCell>
                <TableCell>Confirmation Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {confirmedLots.map((lot) => (
                <TableRow 
                  key={lot.valuation_id} 
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {lot.lotNumber}
                  </TableCell>
                  <TableCell>{lot.teaGrade || 'N/A'}</TableCell>
                  <TableCell>{lot.noOfBags || 'N/A'}</TableCell>
                  <TableCell>{lot.totalNetWeight ? `${lot.totalNetWeight} kg` : 'N/A'}</TableCell>
                  <TableCell>{lot.valuationAmount ? (lot.valuationAmount) : 'N/A'}</TableCell>
                  <TableCell>{formatDate(lot.valuationDate)}</TableCell>
                  <TableCell>{formatDate(lot.confirmed_at)}</TableCell>
                  <TableCell>
                    <Chip 
                      label="Confirmed" 
                      color="success" 
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </BrokerLayout>
  );
};

export default BrokerConfirmLots;
