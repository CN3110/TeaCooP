import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import { 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  Pagination,
  Paper,
  Typography,
  Container,
  Grid,
  Box,
  Card,
  CardContent,
  Divider,
  IconButton,
  InputAdornment,
  Chip,
  Tooltip,
  FormControl,
  InputLabel,
  Stack
} from '@mui/material';
import { 
  FileDownload as FileDownloadIcon, 
  PictureAsPdf as PdfIcon, 
  FilterAlt as FilterIcon,
  RestartAlt as ResetIcon,
  DateRange as DateRangeIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import EmployeeLayout from "../../../components/EmployeeLayout/EmployeeLayout.jsx";

const RawTeaReportPage = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [route, setRoute] = useState('');
  const [allReportData, setAllReportData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(1);
  const [routes, setRoutes] = useState([]);
  const [totalRandalu, setTotalRandalu] = useState(0);
  const [totalGreenTea, setTotalGreenTea] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:3001/api/reports/raw-tea');
        const data = await res.json();
        setAllReportData(data);
        const uniqueRoutes = [...new Set(data.map(item => item.route))];
        setRoutes(uniqueRoutes);
      } catch (error) {
        console.error("Failed to fetch raw tea data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  useEffect(() => {
    let filtered = allReportData;
    if (fromDate && toDate) {
      filtered = filtered.filter(item => {
        const itemDate = format(new Date(item.date), 'yyyy-MM-dd');
        return itemDate >= fromDate && itemDate <= toDate;
      });
    }
    if (route) {
      filtered = filtered.filter(item => item.route === route);
    }
    setFilteredData(filtered);

    let randaluSum = 0, greenTeaSum = 0;
    filtered.forEach(item => {
      randaluSum += Number(item.randalu_weight) || 0;
      greenTeaSum += Number(item.green_tea_weight) || 0;
    });
    setTotalRandalu(randaluSum);
    setTotalGreenTea(greenTeaSum);
    
    // Reset to first page when filters change
    setPage(1);
  }, [fromDate, toDate, route, allReportData]);

  const itemsPerPage = 10;
  const paginatedData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const pageCount = Math.ceil(filteredData.length / itemsPerPage);

  const handleDownloadExcel = () => {
  const dataToExport = filteredData.map(item => ({
    Date: format(new Date(item.date), 'yyyy-MM-dd'),
    Route: item.route,
    'Randalu Weight (kg)': Number(item.randalu_weight).toFixed(2),
    'Green Tea Weight (kg)': Number(item.green_tea_weight).toFixed(2),
    'Total Weight (kg)': (Number(item.randalu_weight) + Number(item.green_tea_weight)).toFixed(2)
  }));

  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Raw Tea Report');
  XLSX.writeFile(workbook, `RawTeaReport_${new Date().toISOString().split('T')[0]}.xlsx`);
};

  const handleDownloadPDF = () => {
  const doc = new jsPDF();
  
  // Get user info from localStorage
  const employeeId = localStorage.getItem('userId') || 'Unknown';
  const generatedAt = new Date().toLocaleString();
  
  // Prepare data for the table
  const tableData = filteredData.map(item => [
    format(new Date(item.date), 'yyyy-MM-dd'),
    item.route,
    Number(item.randalu_weight).toFixed(2),
    Number(item.green_tea_weight).toFixed(2),
    (Number(item.randalu_weight) + Number(item.green_tea_weight)).toFixed(2)
  ]);
  
  // Calculate total pages needed
  const recordsPerPage = 25;
  const totalPages = Math.ceil(tableData.length / recordsPerPage);
  
  // Add each page
  for (let i = 0; i < totalPages; i++) {
    if (i > 0) {
      doc.addPage();
    }
    
    // Header on every page
    doc.setFontSize(18);
    doc.text('Raw Tea Delivery Report', 105, 15, { align: 'center' });
    
    // Date range info if filtered
    if (fromDate || toDate) {
      doc.setFontSize(12);
      const dateRangeText = `${fromDate ? `From: ${fromDate}` : ''} ${toDate ? `To: ${toDate}` : ''}`;
      doc.text(dateRangeText, 105, 25, { align: 'center' });
    }
    
    // Route info if filtered
    if (route) {
      doc.setFontSize(12);
      doc.text(`Route: ${route}`, 105, 30, { align: 'center' });
    }
    
    // Get data for current page
    const startIndex = i * recordsPerPage;
    const endIndex = Math.min(startIndex + recordsPerPage, tableData.length);
    const pageData = tableData.slice(startIndex, endIndex);
    
    // AutoTable for current page
    autoTable(doc, {
      startY: 40, // Increased slightly to accommodate header
      head: [['Date', 'Route', 'Randalu Weight (kg)', 'Green Tea Weight (kg)', 'Total Weight (kg)']],
      body: pageData,
      margin: { top: 45 },
      styles: { fontSize: 9 },
      headStyles: { fillColor: [76, 175, 80] },
      didDrawPage: function (data) {
        // Footer on every page
        doc.setFontSize(10);
        doc.setTextColor(100);
        
        // Page number
        const pageNumber = `Page ${i + 1} of ${totalPages}`;
        doc.text(pageNumber, data.settings.margin.left, doc.internal.pageSize.height - 10);
        
        // Report generated info (on every page)
        doc.text(`Report generated by: ${employeeId}`, 105, doc.internal.pageSize.height - 20, { align: 'center' });
        doc.text(`Generated at: ${generatedAt}`, 105, doc.internal.pageSize.height - 10, { align: 'center' });
        
        // Totals only on last page
        if (i === totalPages - 1) {
          const finalY = data.cursor.y + 10;
          doc.setFontSize(12);
          doc.text(`Total Randalu Weight: ${totalRandalu.toFixed(2)} kg`, 14, finalY);
          doc.text(`Total Green Tea Weight: ${totalGreenTea.toFixed(2)} kg`, 14, finalY + 7);
          doc.text(`Combined Total: ${(totalRandalu + totalGreenTea).toFixed(2)} kg`, 14, finalY + 14);
        }
      }
    });
  }
  
  doc.save(`RawTeaReport${generatedAt}.pdf`);
};

  const handleReset = () => {
    setFromDate('');
    setToDate('');
    setRoute('');
  };

  const navigate = useNavigate();


  return (
    <EmployeeLayout>
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button 
  variant="outlined" 
  color="primary" 
  startIcon={<ArrowBack />}
  onClick={() => navigate('/report-dashboard')}
>
  Back
</Button>

          <Typography variant="h4" component="h1" color="primary" fontWeight="500">
            Raw Tea Delivery Report
          </Typography>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Download Excel">
              <Button 
                variant="outlined" 
                color="success" 
                onClick={handleDownloadExcel}
                startIcon={<FileDownloadIcon />}
              >
                Excel
              </Button>
            </Tooltip>
            <Tooltip title="Download PDF">
              <Button 
                variant="outlined" 
                color="error" 
                onClick={handleDownloadPDF}
                startIcon={<PdfIcon />}
              >
                PDF
              </Button>
            </Tooltip>
          </Stack>
        </Box>

        <Paper elevation={1} sx={{ p: 2, mb: 4, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="From Date"
                type="date"
                value={fromDate}
                onChange={e => setFromDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DateRangeIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="To Date"
                type="date"
                value={toDate}
                onChange={e => setToDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DateRangeIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel id="route-select-label">Route</InputLabel>
                <Select
                  labelId="route-select-label"
                  value={route}
                  label="Route"
                  onChange={e => setRoute(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <FilterIcon color="primary" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="">All Routes</MenuItem>
                  {routes.map(r => (
                    <MenuItem key={r} value={r}>{r}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button 
                fullWidth 
                variant="outlined" 
                color="secondary"
                startIcon={<ResetIcon />}
                onClick={handleReset}
              >
                Reset Filters
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Active Filters Display */}
        {(fromDate || toDate || route) && (
          <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1, mt: 0.5 }}>
              Active filters:
            </Typography>
            {fromDate && (
              <Chip 
                label={`From: ${format(new Date(fromDate), 'MMM dd, yyyy')}`} 
                size="small" 
                color="primary" 
                variant="outlined"
              />
            )}
            {toDate && (
              <Chip 
                label={`To: ${format(new Date(toDate), 'MMM dd, yyyy')}`} 
                size="small" 
                color="primary" 
                variant="outlined"
              />
            )}
            {route && (
              <Chip 
                label={`Route: ${route}`} 
                size="small" 
                color="primary" 
                variant="outlined" 
              />
            )}
          </Box>
        )}

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: '#e8f5e9', height: '100%' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Randalu Weight
                </Typography>
                <Typography variant="h4" component="div" color="#2e7d32">
                  {totalRandalu.toFixed(2)} kg
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: '#e3f2fd', height: '100%' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Green Tea Weight
                </Typography>
                <Typography variant="h4" component="div" color="#1565c0">
                  {totalGreenTea.toFixed(2)} kg
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: '#fce4ec', height: '100%' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Combined Total Weight
                </Typography>
                <Typography variant="h4" component="div" color="#c2185b">
                  {(totalRandalu + totalGreenTea).toFixed(2)} kg
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Data Table */}
        <Paper elevation={2} sx={{ mb: 3, overflow: 'hidden', borderRadius: 1 }}>
          <Box sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Delivery ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Route</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Randalu Weight (kg)</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Green Tea Weight (kg)</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Total Weight (kg)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">Loading data...</TableCell>
                  </TableRow>
                ) : paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No data found with selected filters</TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((item, idx) => (
                    <TableRow 
                      key={idx}
                      sx={{ 
                        '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                        '&:hover': { backgroundColor: '#f1f8e9' }
                      }}
                    >
                      <TableCell>{format(new Date(item.date), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>{item.deliveryId}</TableCell>
                      <TableCell>{item.route}</TableCell>
                      <TableCell>{Number(item.randalu_weight).toFixed(2)}</TableCell>
                      <TableCell>{Number(item.green_tea_weight).toFixed(2)}</TableCell>
                      <TableCell>
                        <Typography fontWeight="medium">
                          {(Number(item.randalu_weight) + Number(item.green_tea_weight)).toFixed(2)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Box>
        </Paper>

        {/* Pagination */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>

        <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            Showing {paginatedData.length} of {filteredData.length} records
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Last updated: {format(new Date(), 'MMM dd, yyyy HH:mm')}
          </Typography>
        </Box>
      </Paper>
    </Container>
    </EmployeeLayout>
  );
};

export default RawTeaReportPage;