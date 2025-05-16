import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Grid,
  Select,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Pagination,
  Container,
  Stack,
  Tooltip,
  Chip,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";
import EmployeeLayout from "../../../components/EmployeeLayout/EmployeeLayout.jsx";

const SupplierRecords = () => {
  const [report, setReport] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [transportFilter, setTransportFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    fetchReport();
  }, [fromDate, toDate, transportFilter]);

  const fetchReport = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/reports/supplier-records",
        {
          params: { from: fromDate, to: toDate, transport: transportFilter },
        }
      );
      setReport(response.data);
    } catch (err) {
      console.error("Error fetching report:", err);
    }
  };

  const handleClearFilters = () => {
    setFromDate("");
    setToDate("");
    setTransportFilter("All");
    setCurrentPage(1);
  };

  const calculateTotals = () => {
    return report.reduce(
      (totals, rec) => {
        totals.randalu += Number(rec.randalu);
        totals.greenTeaLeaves += Number(rec.greenTeaLeaves);
        totals.rawTea += Number(rec.rawTea);
        totals.selfTransportedRawTea += Number(rec.selfTransportedRawTea);
        totals.usedTransportationRawTea += Number(rec.usedTransportationRawTea);
        return totals;
      },
      { randalu: 0, greenTeaLeaves: 0, rawTea: 0, selfTransportedRawTea: 0, usedTransportationRawTea: 0 }
    );
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet([]);
    const totals = calculateTotals();

    const filterInfo = [];
    if (fromDate) filterInfo.push(`From: ${fromDate}`);
    if (toDate) filterInfo.push(`To: ${toDate}`);
    if (transportFilter !== "All") filterInfo.push(`Transport: ${transportFilter}`);

    const titleText = filterInfo.length
      ? "Supplier Records Report (Filtered)"
      : "Supplier Records Report";

    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [titleText],
        [`Filters: ${filterInfo.join(", ")}`],
        [`Generated: ${format(new Date(), "yyyy-MM-dd HH:mm:ss")}`],
        [],
      ],
      { origin: "A1" }
    );

    const exportData = report.map((rec) => ({
      "Supplier ID": rec.supplierId,
      "Randalu (kg)": rec.randalu,
      "Green Tea (kg)": rec.greenTeaLeaves,
      "Raw Tea (kg): Randalu + Green Tea": rec.rawTea,
      "Self Transported Raw Tea (kg): Raw Tea": rec.selfTransportedRawTea,
      "Used Transport Raw Tea (kg): Raw Tea": rec.usedTransportationRawTea,
    }));

    XLSX.utils.sheet_add_json(worksheet, exportData, {
      origin: "A5",
      skipHeader: false,
    });

    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [],
        [
          "Total Randalu (kg)",
          "Total Green Tea (kg)",
          "Total Raw Tea (kg): Randalu + Green Tea",
          "Total Self Transported (kg): Raw Tea",
          "Total Used Transport (kg): Raw Tea",
        ],
        [
          totals.randalu,
          totals.greenTeaLeaves,
          totals.rawTea,
          totals.selfTransportedRawTea,
          totals.usedTransportationRawTea,
        ],
      ],
      { origin: `A${exportData.length + 7}` }
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, "Supplier_Report.xlsx");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const employeeId = localStorage.getItem("userId") || "Unknown";
    const generatedAt = new Date().toLocaleString();

    const totals = calculateTotals();

    let title = "Supplier Records Report";
    if (fromDate || toDate || transportFilter !== "All") {
      title += " (Filtered)";
    }

    doc.setFontSize(16);
    doc.text(title, 14, 15);
    doc.setFontSize(11);

    let filterStr = "";
    if (fromDate) filterStr += `From: ${fromDate}  `;
    if (toDate) filterStr += `To: ${toDate}  `;
    if (transportFilter !== "All") filterStr += `Transport: ${transportFilter}`;

    doc.text(filterStr, 14, 25);
    

    const tableData = report.map((rec) => [
      rec.supplierId,
      rec.randalu,
      rec.greenTeaLeaves,
      rec.rawTea,
      rec.selfTransportedRawTea,
      rec.usedTransportationRawTea,
    ]);

    doc.autoTable({
      head: [
        [
          "Supplier Name",
          "Randalu (kg)",
          "Green Tea (kg)",
          "Total Raw Tea (kg): Randalu + Green Tea",
          "Total Self Transported (kg): Raw Tea",
          "Total Used Transport (kg): Raw Tea",
        ],
      ],
      body: tableData,
      startY: 40,
    });

    const finalY = doc.lastAutoTable.finalY || 40;
    doc.text(`Total Randalu (kg): ${totals.randalu.toFixed(2)}`, 14, finalY + 10);
    doc.text(`Total Green Tea (kg): ${totals.greenTeaLeaves.toFixed(2)}`, 14, finalY + 16);
    doc.text(`Total Raw Tea (kg): ${totals.rawTea.toFixed(2)}`, 14, finalY + 22);
    doc.text(
      `Total Self Transported (kg): ${totals.selfTransportedRawTea.toFixed(2)}`,
      14,
      finalY + 28
    );
    doc.text(
      `Total Used Transport (kg): ${totals.usedTransportationRawTea.toFixed(2)}`,
      14,
      finalY + 34
    );

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Report generated by: ${employeeId}`, 14, doc.internal.pageSize.height - 10);
    doc.text(`Generated at: ${generatedAt}`, 14, doc.internal.pageSize.height - 5);
    doc.save("Supplier_Report.pdf");
  };

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = report.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(report.length / recordsPerPage);

  return ( 
   <EmployeeLayout>
  <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" color="primary" fontWeight="500">
          Supplier Records Report
        </Typography>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Download Excel">
            <Button
              variant="outlined"
              color="success"
              onClick={downloadExcel}
              startIcon={<DownloadIcon />}
            >
              Excel
            </Button>
          </Tooltip>
          <Tooltip title="Download PDF">
            <Button
              variant="outlined"
              color="error"
              onClick={downloadPDF}
              startIcon={<DownloadIcon />}
            >
              PDF
            </Button>
          </Tooltip>
        </Stack>
      </Box>

      {/* Filter Section */}
      <Paper elevation={1} sx={{ p: 2, mb: 4, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="From Date"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="To Date"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              startIcon={<ClearIcon />}
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Active Filters */}
      {(fromDate || toDate || transportFilter !== "All") && (
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
          {transportFilter !== "All" && (
            <Chip
              label={`Transport: ${transportFilter}`}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
      )}
      

      {/* Table and Pagination come here */}

      <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Supplier ID</TableCell>
              <TableCell>Randalu (kg)</TableCell>
              <TableCell>Green Tea (kg)</TableCell>
              <TableCell>Raw Tea (kg): Randalu + Green Tea</TableCell>
              <TableCell>Self Transported (kg): Raw Tea (kg)</TableCell>
              <TableCell>Used Transport (kg): Raw Tea (kg)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRecords.map((rec, index) => (
              <TableRow key={index}>
                <TableCell>{rec.supplierId}</TableCell>
                <TableCell>{rec.randalu}</TableCell>
                <TableCell>{rec.greenTeaLeaves}</TableCell>
                <TableCell>{rec.rawTea}</TableCell>
                <TableCell>{rec.selfTransportedRawTea}</TableCell>
                <TableCell>{rec.usedTransportationRawTea}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={2} display="flex" justifyContent="center">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(e, val) => setCurrentPage(val)}
          color="primary"
        />
      </Box>
    </Paper>
      </Container>
    </EmployeeLayout>
  );
};

export default SupplierRecords;
