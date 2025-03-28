import React, { useState, useEffect, useMemo } from 'react';
import { 
  getEmployees as fetchEmployeesApi, 
  createEmployee as createEmployeeApi,
  updateEmployee as updateEmployeeApi,
  deleteEmployee as deleteEmployeeApi
} from '../../api/employeeApi';
import './ManageEmployee.css';
// Material-UI Components
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@mui/material/Link';

// Icons
import Search from '@mui/icons-material/Search';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import Add from '@mui/icons-material/Add';
import Save from '@mui/icons-material/Save';
import Cancel from '@mui/icons-material/Cancel';

const ManageEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    employeeId: '',
    employeeName: '',
    employeeContact_no: '',
    employeeEmail: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fetch employees from API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchEmployeesApi();
        const data = Array.isArray(response?.data) ? response.data : [];
        setEmployees(data);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 
                            err.message || 
                            'Failed to fetch employees';
        setError(errorMessage);
        showSnackbar(errorMessage, 'error');
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEmployees();
  }, []);

  // Filter employees based on search term
  const filteredEmployees = useMemo(() => {
    if (!Array.isArray(employees)) return [];
    
    return employees.filter(employee => {
      if (!employee) return false;
      return (
        (employee.employeeName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (employee.employeeId?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      );
    });
  }, [searchTerm, employees]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddDialogOpen = () => {
    setNewEmployee({
      employeeId: '',
      employeeName: '',
      employeeContact_no: '',
      employeeEmail: ''
    });
    setOpenAddDialog(true);
  };

  const handleAddDialogClose = () => {
    setOpenAddDialog(false);
  };

  const handleEditDialogOpen = (employee) => {
    setCurrentEmployee({...employee});
    setOpenEditDialog(true);
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
  };

  const handleDeleteDialogOpen = (employee) => {
    setCurrentEmployee(employee);
    setOpenDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEmployee(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  const addEmployee = async () => {
    try {
      // Validation
      if (!newEmployee.employeeId || !newEmployee.employeeName || 
          !newEmployee.employeeContact_no || !newEmployee.employeeEmail) {
        showSnackbar('All fields are required', 'error');
        return;
      }

      // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmployee.employeeEmail)) {
      showSnackbar('Please enter a valid email address', 'error');
      return;
    }

    setError(null);
    const response = await createEmployeeApi(newEmployee);
    
    setEmployees(prev => [...prev, response.data.employee]);
    showSnackbar(response.data.message || 'Employee added successfully', 'success');
    handleAddDialogClose();
  } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         'Failed to add employee';
      showSnackbar(errorMessage, 'error');
    }
  };

  const updateEmployee = async () => {
    try {
      // Validate required fields
      if (!currentEmployee?.employeeId || 
          !currentEmployee?.employeeName || 
          !currentEmployee?.employeeContact_no || 
          !currentEmployee?.employeeEmail) {
        showSnackbar('All fields are required', 'error');
        return;
      }
  
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(currentEmployee.employeeEmail)) {
        showSnackbar('Please enter a valid email address', 'error');
        return;
      }
  
      setError(null);
      
      // Call the API to update employee
      const response = await updateEmployeeApi(
        currentEmployee.employeeId, 
        {
          employeeName: currentEmployee.employeeName,
          employeeContact_no: currentEmployee.employeeContact_no,
          employeeEmail: currentEmployee.employeeEmail
        }
      );
  
      // Update local state with the updated employee data
      setEmployees(prev => 
        prev.map(emp => 
          emp.employeeId === currentEmployee.employeeId 
            ? { ...emp, ...currentEmployee } 
            : emp
        )
      );
  
      // Show success message and close dialog
      showSnackbar('Employee updated successfully', 'success');
      handleEditDialogClose();
    } catch (error) {
      console.error('Update employee error:', error);
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Failed to update employee';
      showSnackbar(errorMessage, 'error');
    }
  };

  const deleteEmployee = async () => {
    try {
      setError(null);
      
      // Call the API to delete employee
      const response = await deleteEmployeeApi(currentEmployee.employeeId);
  
      // Check if deletion was successful
      if (response.status === 200 || response.status === 204) {
        // Update local state by removing the deleted employee
        setEmployees(prev => 
          prev.filter(emp => emp.employeeId !== currentEmployee.employeeId)
        );
        
        // Show success message and close dialog
        showSnackbar('Employee deleted successfully', 'success');
        handleDeleteDialogClose();
      } else {
        throw new Error('Failed to delete employee');
      }
    } catch (error) {
      console.error('Delete employee error:', error);
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Failed to delete employee';
      showSnackbar(errorMessage, 'error');
    }
  };

  return (
    <div className="manage-employees-container">
      <h1 className="manage-employees-header">Manage Employees</h1>
      
      <div className="employee-actions-container">
        <TextField
          className="employee-search-input"
          variant="outlined"
          placeholder="Search by name or ID"
          InputProps={{
            startAdornment: <Search style={{ marginRight: '10px' }} />
          }}
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ width: '300px' }}
        />
        <Button
          className="add-employee-btn"
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddDialogOpen}
        >
          Add New Employee
        </Button>
      </div>

      <TableContainer component={Paper} className="employee-table">
        <Table>
          <TableHead className="employee-table-header">
            <TableRow>
              <TableCell className="employee-table-header-cell">Employee ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Contact No</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="loading-state">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} className="error-state">
                  Error: {error}
                </TableCell>
              </TableRow>
            ) : filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="empty-state">
                  No employees found
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployees.map((employee) => (
                <TableRow key={employee.employeeId} className="employee-table-row">
                  <TableCell>{employee.employeeId}</TableCell>
                  <TableCell>{employee.employeeName}</TableCell>
                  <TableCell>{employee.employeeContact_no}</TableCell>
                  <TableCell>
                    <Link href={`mailto:${employee.employeeEmail}`}>
                      {employee.employeeEmail}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {employee.created_at ? new Date(employee.created_at).toLocaleString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton 
                        className="action-btn edit-btn" 
                        onClick={() => handleEditDialogOpen(employee)}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton 
                        className="action-btn delete-btn" 
                        onClick={() => handleDeleteDialogOpen(employee)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Employee Dialog */}
      <Dialog open={openAddDialog} onClose={handleAddDialogClose} className="employee-dialog">
        <DialogTitle className="dialog-title">Add New Employee</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Employee ID"
            name="employeeId"
            fullWidth
            required
            value={newEmployee.employeeId}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Name"
            name="employeeName"
            fullWidth
            required
            value={newEmployee.employeeName}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Contact No"
            name="employeeContact_no"
            fullWidth
            required
            value={newEmployee.employeeContact_no}
            onChange={handleInputChange}
            inputProps={{
              pattern: "[0-9]*",
              title: "Please enter numbers only"
            }}
          />
          <TextField
            margin="dense"
            label="Email"
            name="employeeEmail"
            type="email"
            fullWidth
            required
            value={newEmployee.employeeEmail}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose} color="primary" startIcon={<Cancel />}>
            Cancel
          </Button>
          <Button onClick={addEmployee} color="primary" startIcon={<Save />}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog open={openEditDialog} onClose={handleEditDialogClose}>
        <DialogTitle>Edit Employee</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Employee ID"
            name="employeeId"
            fullWidth
            disabled
            value={currentEmployee?.employeeId || ''}
          />
          <TextField
            margin="dense"
            label="Name"
            name="employeeName"
            fullWidth
            required
            value={currentEmployee?.employeeName || ''}
            onChange={handleEditInputChange}
          />
          <TextField
            margin="dense"
            label="Contact No"
            name="employeeContact_no"
            fullWidth
            required
            value={currentEmployee?.employeeContact_no || ''}
            onChange={handleEditInputChange}
            inputProps={{
              pattern: "[0-9]*",
              title: "Please enter numbers only"
            }}
          />
          <TextField
            margin="dense"
            label="Email"
            name="employeeEmail"
            type="email"
            fullWidth
            required
            value={currentEmployee?.employeeEmail || ''}
            onChange={handleEditInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose} color="primary" startIcon={<Cancel />}>
            Cancel
          </Button>
          <Button onClick={updateEmployee} color="primary" startIcon={<Save />}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete employee {currentEmployee?.employeeName} (ID: {currentEmployee?.employeeId})?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteEmployee} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        className={snackbar.severity === 'success' ? 'success-snackbar' : 'error-snackbar'}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ManageEmployees;