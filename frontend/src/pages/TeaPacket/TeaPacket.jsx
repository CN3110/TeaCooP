
import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Input,
  Button,
  Card,
  Typography,
  Grid,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import EmployeeLayout from "../../components/EmployeeLayout/EmployeeLayout";
import AdminLayout from "../../components/AdminLayout/AdminLayout";

const TeaPacket = () => {
  const [packets, setPackets] = useState([]);
  const [availableData, setAvailableData] = useState({
    availableForPackets: 0,
    allocatedForPackets: 0,
    totalUsedForPackets: 0,
  });
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [formData, setFormData] = useState({
    productionDate: "",
    sourceMadeTeaWeight: "",
    packetWeight: "",
    numberOfPackets: "",
  });

  const [editingPacketId, setEditingPacketId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    packetId: null,
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchPackets = async ({ pagination: customPagination } = {}) => {
    setLoading(true);
    const currentPage = customPagination?.current || pagination.current;
    const pageSize = customPagination?.pageSize || pagination.pageSize;

    try {
      const res = await axios.get("http://localhost:3001/api/tea-packets", {
        params: { page: currentPage, limit: pageSize },
      });
      
      // Debug log the response to see what data structure is coming back
      console.log("API Response data:", res.data);
      
      // Explicitly process each packet's date fields to ensure they exist
      const formattedData = (res.data.data || []).map(packet => {
        console.log("Raw packet data:", packet); // Debug log each packet
        
        return {
          ...packet,
          // Force a valid date string for productionDate if it exists
          // Try multiple formats to ensure date is properly parsed
          productionDate: packet.productionDate || null
        };
      });
      
      console.log("Formatted packets:", formattedData); // Debug log the formatted data
      setPackets(formattedData);
      setPagination((prev) => ({
        ...prev,
        current: currentPage,
        pageSize,
        total: res.data.total || 0,
      }));
    } catch (error) {
      console.error("Error fetching tea packets:", error);
      showSnackbar("Failed to fetch tea packets", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableMadeTea = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3001/api/tea-packets/available"
      );
      setAvailableData(res.data);
    } catch (error) {
      console.error("Error fetching available made tea:", error);
      showSnackbar("Failed to fetch available made tea data", "error");
    }
  };

  useEffect(() => {
    fetchPackets();
    fetchAvailableMadeTea();
  }, []);

  const calculatePackets = (source, packet) => {
    const sw = parseFloat(source);
    const pw = parseFloat(packet);
    if (!sw || !pw || pw <= 0) return { numberOfPackets: 0, remaining: 0 };
    const numberOfPackets = Math.floor(sw / pw);
    const remaining = sw - numberOfPackets * pw;
    return { numberOfPackets, remaining };
  };

  const handleInputChange = (field, value) => {
    if (
      (field === "sourceMadeTeaWeight" || field === "packetWeight") &&
      parseFloat(value) < 0
    ) {
      showSnackbar(`${field === "sourceMadeTeaWeight" ? "Source weight" : "Packet weight"} cannot be negative.`, "warning");
      return;
    }

    const updatedForm = { ...formData, [field]: value };

    if (field === "sourceMadeTeaWeight" || field === "packetWeight") {
      const { numberOfPackets } = calculatePackets(
        updatedForm.sourceMadeTeaWeight,
        updatedForm.packetWeight
      );
      updatedForm.numberOfPackets = numberOfPackets || "";
    }

    setFormData(updatedForm);
  };

  const onFinish = async () => {
    const employeeId = localStorage.getItem("userId");
    if (!employeeId) {
      showSnackbar("User ID not found in local storage.", "error");
      return;
    }

    const today = moment().format("YYYY-MM-DD");
    if (formData.productionDate > today) {
      showSnackbar("Production date cannot be in the future.", "warning");
      return;
    }

    if (
      !formData.productionDate ||
      !formData.sourceMadeTeaWeight ||
      !formData.packetWeight ||
      formData.numberOfPackets === ""
    ) {
      showSnackbar("All fields are required and must be valid.", "warning");
      return;
    }

    try {
      const payload = {
        ...formData,
        numberOfPackets: parseInt(formData.numberOfPackets, 10),
        ...(editingPacketId ? { updatedBy: employeeId } : { createdBy: employeeId }),
      };

      if (editingPacketId) {
        await axios.put(`http://localhost:3001/api/tea-packets/${editingPacketId}`, payload);
        showSnackbar("Packet record updated successfully");
      } else {
        await axios.post("http://localhost:3001/api/tea-packets", payload);
        showSnackbar("Packet record added successfully");
      }

      setFormData({
        productionDate: "",
        sourceMadeTeaWeight: "",
        packetWeight: "",
        numberOfPackets: "",
      });
      setEditingPacketId(null);
      fetchPackets();
      fetchAvailableMadeTea();
    } catch (err) {
      showSnackbar(err.response?.data?.error || "Failed to save packet record", "error");
    }
  };

  const confirmDelete = (packetId) => {
    setConfirmDialog({ open: true, packetId });
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/tea-packets/${confirmDialog.packetId}`);
      fetchPackets();
      fetchAvailableMadeTea();
      showSnackbar("Record deleted successfully");
    } catch (error) {
      console.error("Error deleting record:", error);
      showSnackbar("Failed to delete packet record", "error");
    } finally {
      setConfirmDialog({ open: false, packetId: null });
    }
  };

  const handleEdit = (row) => {
    console.log("Edit row data:", row); // Debug log
    setEditingPacketId(row.packetId);
    
    // Make sure we have a valid date for the form
    let dateValue = "";
    
    if (row.productionDate) {
      try {
        // Try to parse and format the date if it exists
        dateValue = moment(row.productionDate).format("YYYY-MM-DD");
        console.log("Formatted production date for edit:", dateValue);
      } catch (err) {
        console.error("Error formatting date for edit:", err);
      }
    }
    
    setFormData({
      productionDate: dateValue,
      sourceMadeTeaWeight: row.sourceMadeTeaWeight,
      packetWeight: row.packetWeight,
      numberOfPackets: row.numberOfPackets,
    });
  };

  const columns = [
    {
      field: "productionDate",
      headerName: "Date",
      flex: 1,
      renderCell: (params) => {
        console.log("Rendering date cell, value:", params.value);
        if (params.value) {
          try {
            // Try multiple date formatting approaches
            return moment(params.value).format("YYYY-MM-DD");
          } catch (err) {
            console.error("Error rendering date:", err);
            return String(params.value);
          }
        }
        return '';
      }
    },
    { field: "sourceMadeTeaWeight", headerName: "Source Weight (kg)", flex: 1 },
    { field: "packetWeight", headerName: "Packet Weight (kg)", flex: 1 },
    { field: "numberOfPackets", headerName: "Number of Packets", flex: 1 },
    { field: "employeeName", headerName: "Created By", flex: 1 },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
      renderCell: (params) => {
        if (params.value) {
          try {
            return moment(params.value).format("YYYY-MM-DD");
          } catch (err) {
            console.error("Error rendering createdAt date:", err);
            return String(params.value);
          }
        }
        return '';
      }
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <Button onClick={() => handleEdit(params.row)}>Edit</Button>
          <Button color="error" onClick={() => confirmDelete(params.row.packetId)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  
const userRole = localStorage.getItem('userRole');
const Layout = userRole === 'admin' ? AdminLayout : EmployeeLayout;

  return (
    <Layout>
      <h2>Tea Packet Management</h2>
      <div style={{ padding: 20 }}>
        <Grid container spacing={2} style={{ marginBottom: 24 }}>
          <Grid item xs={12} sm={4}>
            <Card style={{ padding: 16 }}>
              <Typography variant="subtitle2">Allocated for Packets (5%)</Typography>
              <Typography variant="h6">{availableData.allocatedForPackets.toFixed(2)} kg</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card style={{ padding: 16 }}>
              <Typography variant="subtitle2">Total Used for Packets</Typography>
              <Typography variant="h6">{availableData.totalUsedForPackets} kg</Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card style={{ padding: 16 }}>
              <Typography variant="subtitle2">Available for Packets</Typography>
              <Typography
                variant="h6"
                color={availableData.availableForPackets > 0 ? "green" : "error"}
              >
                {availableData.availableForPackets.toFixed(2)} kg
              </Typography>
            </Card>
          </Grid>
        </Grid>

        <Card style={{ padding: 24, marginBottom: 24 }}>
          <Typography variant="h6" gutterBottom>
            {editingPacketId ? "Edit Packet Record" : "Add New Packet Record"}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel shrink htmlFor="productionDate">Production Date</InputLabel>
                <Input
                  type="date"
                  inputProps={{ max: moment().format("YYYY-MM-DD") }}
                  value={formData.productionDate}
                  onChange={(e) =>
                    handleInputChange("productionDate", e.target.value)
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel shrink htmlFor="sourceMadeTeaWeight">Source Weight (kg)</InputLabel>
                <Input
                  type="number"
                  inputProps={{ step: 0.01 }}
                  value={formData.sourceMadeTeaWeight}
                  onChange={(e) =>
                    handleInputChange("sourceMadeTeaWeight", e.target.value)
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel shrink htmlFor="packetWeight">Packet Weight (kg)</InputLabel>
                <Input
                  type="number"
                  inputProps={{ step: 0.01 }}
                  value={formData.packetWeight}
                  onChange={(e) =>
                    handleInputChange("packetWeight", e.target.value)
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel shrink htmlFor="numberOfPackets">Number of Packets</InputLabel>
                <Input type="number" value={formData.numberOfPackets} readOnly />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" onClick={onFinish}>
                {editingPacketId ? "Update Packet Record" : "Add Packet Record"}
              </Button>
            </Grid>
          </Grid>
        </Card>

        <Card style={{ padding: 24 }}>
          <Typography variant="h6" gutterBottom>
            Packet Records
          </Typography>
          <div style={{ height: 500, width: "100%" }}>
            <DataGrid
              rows={packets}
              columns={columns}
              getRowId={(row) => row.packetId}
              paginationModel={{
                page: pagination.current - 1,
                pageSize: pagination.pageSize,
              }}
              rowCount={pagination.total}
              loading={loading}
              paginationMode="server"
              onPaginationModelChange={(model) =>
                fetchPackets({
                  pagination: {
                    current: model.page + 1,
                    pageSize: model.pageSize,
                  },
                })
              }
            />
          </div>
        </Card>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, packetId: null })}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this packet record?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, packetId: null })}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default TeaPacket;