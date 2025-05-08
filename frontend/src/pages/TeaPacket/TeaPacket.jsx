import React, { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Input,
  Button,
  Card,
  Typography,
  Grid
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import moment from 'moment';
import EmployeeLayout from '../../components/EmployeeLayout/EmployeeLayout'; 


const TeaPacket = () => {
  const [packets, setPackets] = useState([]);
  const [availableData, setAvailableData] = useState({
    availableForPackets: 0,
    allocatedForPackets: 0,
    totalUsedForPackets: 0
  });
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  const [formData, setFormData] = useState({
    productionDate: '',
    sourceMadeTeaWeight: '',
    packetWeight: '',
    numberOfPackets: ''
  });

  const [editingPacketId, setEditingPacketId] = useState(null);

  const fetchPackets = async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:3001/api/tea-packets', {
        params: {
          page: params.pagination?.current || pagination.current,
          limit: params.pagination?.pageSize || pagination.pageSize
        }
      });
      setPackets(data.data || []);
      setPagination((prev) => ({
        ...prev,
        total: data.total || 0
      }));
    } catch (error) {
      console.error('Failed to fetch tea packets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableMadeTea = async () => {
    try {
      const { data } = await axios.get('http://localhost:3001/api/tea-packets/available');
      setAvailableData(data);
    } catch (error) {
      console.error('Failed to fetch available made tea data');
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
    const numPackets = Math.floor(sw / pw);
    const remaining = sw - numPackets * pw;
    return { numberOfPackets: numPackets, remaining };
  };
  

  const handleInputChange = (field, value) => {
    const updatedForm = { ...formData, [field]: value };

    // If relevant fields updated, recalculate numberOfPackets
    if (field === 'sourceMadeTeaWeight' || field === 'packetWeight') {
      const { numberOfPackets, remaining } = calculatePackets(
        updatedForm.sourceMadeTeaWeight,
        updatedForm.packetWeight
      );
      updatedForm.numberOfPackets = numberOfPackets ? numberOfPackets : '';

      setAvailableData((prev) => ({
        ...prev,
        availableForPackets: parseFloat(prev.availableForPackets) + remaining
      }));
    }

    setFormData(updatedForm);
  };

  const onFinish = async () => {
    const employeeId = localStorage.getItem("userId");
    if (!employeeId) {
      alert("User ID not found in local storage.");
      return;
    }
    const today = moment().format("YYYY-MM-DD");
    if (formData.productionDate > today) {
      alert("Production date cannot be in the future.");
      return;
    }
    // Ensure numberOfPackets is a valid number and not empty
    if (
      !formData.productionDate ||
      !formData.sourceMadeTeaWeight ||
      !formData.packetWeight ||
      formData.numberOfPackets === '' ||
      
      
      !employeeId
    ) {
      alert("All fields are required and must be valid.");
      return;
    }
    try {
      await axios.post('http://localhost:3001/api/tea-packets', {
        ...formData,
        productionDate: moment(formData.productionDate).format('YYYY-MM-DD'),
        numberOfPackets: parseInt(formData.numberOfPackets, 10),
        createdBy: employeeId
      });
      alert('Packet record added successfully');
      setFormData({ productionDate: '', sourceMadeTeaWeight: '', packetWeight: '', numberOfPackets: '' });
      fetchPackets();
      fetchAvailableMadeTea();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add packet record');
    }
  };
  

  const handleDelete = async (packetId) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await axios.delete(`http://localhost:3001/api/tea-packets/${packetId}`);
      fetchPackets();
      fetchAvailableMadeTea();
    } catch (err) {
      alert("Failed to delete packet record");
    }
  };

  const handleEdit = (row) => {
    setEditingPacketId(row.packetId);
    setFormData({
      productionDate: moment(row.productionDate).format("YYYY-MM-DD"),
      sourceMadeTeaWeight: row.sourceMadeTeaWeight,
      packetWeight: row.packetWeight,
      numberOfPackets: row.numberOfPackets
    });
  };

  const columns = [
    {
      field: 'productionDate',
      headerName: 'Date',
      flex: 1,
      valueFormatter: (params) => moment(params.value).format('YYYY-MM-DD')
    },
    {
      field: 'sourceMadeTeaWeight',
      headerName: 'Source Weight (kg)',
      flex: 1
    },
    {
      field: 'packetWeight',
      headerName: 'Packet Weight (kg)',
      flex: 1
    },
    {
      field: 'numberOfPackets',
      headerName: 'Number of Packets',
      flex: 1
    },
    {
      field: 'employeeName',
      headerName: 'Created By',
      flex: 1
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      flex: 1,
      valueFormatter: (params) => moment(params.value).format('YYYY-MM-DD HH:mm')
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <>
          <Button onClick={() => handleEdit(params.row)}>Edit</Button>
          <Button color="error" onClick={() => handleDelete(params.row.packetId)}>Delete</Button>
        </>
      )
    }
  ];

  return (
    <EmployeeLayout>
      <h2>Tea Packet Management</h2>
    <div style={{ padding: 20 }}>
      <Grid container spacing={2} style={{ marginBottom: 24 }}>
        <Grid item xs={12} sm={4}>
          <Card style={{ padding: 16 }}>
            <Typography variant="subtitle2">Allocated for Packets (5%)</Typography>
            <Typography variant="h6">{availableData.allocatedForPackets} kg</Typography>
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
              color={availableData.availableForPackets > 0 ? 'green' : 'error'}
            >
              {availableData.availableForPackets.toFixed(2)} kg
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <Card style={{ padding: 24, marginBottom: 24 }}>
        <Typography variant="h6" gutterBottom>
          {editingPacketId ? 'Edit Packet Record' : 'Add New Packet Record'}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel shrink htmlFor="productionDate">Production Date</InputLabel>
              <Input
                type="date"
                inputProps={{ max: moment().format("YYYY-MM-DD") }}
                id="productionDate"
                value={formData.productionDate}
                onChange={(e) => handleInputChange('productionDate', e.target.value)}
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
                onChange={(e) => handleInputChange('sourceMadeTeaWeight', e.target.value)}
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
                onChange={(e) => handleInputChange('packetWeight', e.target.value)}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel shrink htmlFor="numberOfPackets">Number of Packets</InputLabel>
              <Input
                type="number"
                value={formData.numberOfPackets}
                readOnly
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={onFinish}>
              {editingPacketId ? 'Update Packet Record' : 'Add Packet Record'}
            </Button>
          </Grid>
        </Grid>
      </Card>

      <Card style={{ padding: 24 }}>
        <Typography variant="h6" gutterBottom>
          Packet Records
        </Typography>
        <div style={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={packets}
            columns={columns}
            getRowId={(row) => row.packetId}
            paginationModel={{
              page: pagination.current - 1,
              pageSize: pagination.pageSize
            }}
            rowCount={pagination.total}
            loading={loading}
            paginationMode="server"
            onPaginationModelChange={(model) =>
              fetchPackets({
                pagination: {
                  current: model.page + 1,
                  pageSize: model.pageSize
                }
              })
            }
          />
        </div>
      </Card>
    </div>
    </EmployeeLayout>
  );
};

export default TeaPacket;
