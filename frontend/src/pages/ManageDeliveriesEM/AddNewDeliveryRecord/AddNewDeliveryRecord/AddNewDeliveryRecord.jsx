import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import EmployeeLayout from '../../../../components/EmployeeLayout/EmployeeLayout';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import './AddNewDeliveryRecord.css';

const AddNewDeliveryRecord = () => {
  const [routeOptions, setRouteOptions] = useState([]);
  const [driverOptions, setDriverOptions] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success', // success | error | warning | info
  });
   
  const showAlert = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };
  
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };
  

  const [deliveryData, setDeliveryData] = useState({
    supplierId: '',
    transport: '',
    date: '',
    route: '',
    totalWeight: '',
    totalSackWeight: '',
    forWater: '',
    forWitheredLeaves: '',
    forRipeLeaves: '',
    greenTeaLeaves: '',
    randalu: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/deliveryRoutes");
        const data = await response.json();
        setRouteOptions(data);
      } catch (error) {
        console.error("Error fetching routes:", error);
        showAlert('Failed to fetch delivery routes. Please try again later.', 'warning');
      }
    };

    const fetchDrivers = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/drivers"); 
        const data = await response.json();
        const driverOptionsWithSelf = [
          { driverId: "selfTransport", driverName: "Self Transport" },
          ...data
        ];
        setDriverOptions(driverOptionsWithSelf);
      } catch (error) {
        console.error("Error fetching drivers:", error);
        setDriverOptions([{ driverId: "selfTransport", driverName: "Self Transport" }]);
        showAlert('Failed to fetch drivers. Using default options.', 'warning');
      }
    };

    const fetchSuppliers = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/suppliers");
        const data = await response.json();
        setSuppliers(data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        showAlert('Failed to fetch suppliers. Please try again later.', 'warning');
      }
    };

    const today = new Date().toISOString().split('T')[0];
    setDeliveryData(prev => ({ ...prev, date: today }));

    fetchRoutes();
    fetchDrivers();
    fetchSuppliers();
  }, []);

  const totalDeductions = parseFloat(deliveryData.totalSackWeight || 0) + 
                        parseFloat(deliveryData.forWater || 0) + 
                        parseFloat(deliveryData.forWitheredLeaves || 0) + 
                        parseFloat(deliveryData.forRipeLeaves || 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedData = {
      ...deliveryData,
      [name]: value,
    };

    if (name === 'supplierId') {
      const input = value.toLowerCase();
      const suggestions = suppliers.filter(s =>
        s.supplierId.toLowerCase().includes(input) ||
        s.supplierName.toLowerCase().includes(input)
      );
      setFilteredSuggestions(suggestions);
      setSelectedSupplier(null);
    }
    

    if (name === 'transport') {
      const selected = driverOptions.find(d => d.driverId === value);
      setSelectedDriver(selected?.driverId === "selfTransport" ? null : selected);
    }

    // Convert to float for calculation
    const getFloat = val => parseFloat(val) || 0;

    if (
      ['totalWeight', 'totalSackWeight', 'forWater', 'forWitheredLeaves', 'forRipeLeaves', 'randalu'].includes(name)
    ) {
      const totalWeight = getFloat(name === 'totalWeight' ? value : deliveryData.totalWeight);
      const totalSackWeight = getFloat(name === 'totalSackWeight' ? value : deliveryData.totalSackWeight);
      const forWater = getFloat(name === 'forWater' ? value : deliveryData.forWater);
      const forWitheredLeaves = getFloat(name === 'forWitheredLeaves' ? value : deliveryData.forWitheredLeaves);
      const forRipeLeaves = getFloat(name === 'forRipeLeaves' ? value : deliveryData.forRipeLeaves);
      const randalu = getFloat(name === 'randalu' ? value : deliveryData.randalu);

      const greenTeaLeaves = totalWeight - totalSackWeight - forWater - forWitheredLeaves - forRipeLeaves - randalu;
      updatedData.greenTeaLeaves = greenTeaLeaves >= 0 ? greenTeaLeaves.toFixed(2) : 0;
    }

    setDeliveryData(updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSnackbar(prev => ({ ...prev, open: false }));


    // Validate supplier
    const validSupplier = suppliers.find(s => s.supplierId === deliveryData.supplierId);
    if (!validSupplier) {
      showAlert('Supplier ID is not found.', 'error');
      setIsSubmitting(false);
      return;
    }

    // Validate weights
    if (parseFloat(deliveryData.totalWeight)  <= 0) {
      showAlert('Total weight must be greater than 0.', 'error');
      setIsSubmitting(false);
      return;
    }

    if (parseFloat(deliveryData.totalSackWeight || deliveryData.forWater || deliveryData.forRipeLeaves || deliveryData.forWitheredLeaves || deliveryData.greenTeaLeaves || deliveryData.randalu) < 0) {
      showAlert('Weights cannot be negative.', 'error');
      setIsSubmitting(false);
      return;
    }
    if (parseFloat(deliveryData.totalWeight) < totalDeductions) {
      showAlert('Total weight must be greater than total deductions.', 'error');
      setIsSubmitting(false);
      return;
    }

    // Validate date
    const today = new Date().toISOString().split('T')[0];
    if (deliveryData.date !== today) {
      showAlert('Date must be today.', 'error');
      setIsSubmitting(false);
      return;
    }

    const payload = {
      ...deliveryData,
      totalWeight: parseFloat(deliveryData.totalWeight),
      totalSackWeight: parseFloat(deliveryData.totalSackWeight),
      forWater: parseFloat(deliveryData.forWater),
      forWitheredLeaves: parseFloat(deliveryData.forWitheredLeaves),
      forRipeLeaves: parseFloat(deliveryData.forRipeLeaves),
      greenTeaLeaves: parseFloat(deliveryData.greenTeaLeaves),
      randalu: parseFloat(deliveryData.randalu),
    };

    try {
      const response = await fetch("http://localhost:3001/api/deliveries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add delivery");
      }

      showAlert('Delivery added successfully!', 'success');
      setTimeout(() => {
        navigate("/view-delivery-records");
      }, 1500);
    } catch (error) {
      showAlert(`An error occurred: ${error.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <EmployeeLayout>
      <div className='add-new-delivery-container'>
        <h3>Add New Tea Delivery</h3>
        <div className='add-new-delivery'>
          
          
          <Snackbar
  open={snackbar.open}
  autoHideDuration={4000}
  onClose={handleCloseSnackbar}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
<MuiAlert
  onClose={handleCloseSnackbar}
  severity={snackbar.severity}
  sx={{
    width: '100%',
    fontWeight: 'bold',
    fontSize: '1rem',
    backgroundColor:
      snackbar.severity === 'success'
        ? 'rgb(14, 152, 16)'
        : snackbar.severity === 'error'
        ? 'rgb(211,47,47)'
        : snackbar.severity === 'warning'
        ? 'rgb(237, 201, 72)'
        : '#1976d2',
    color: 'white',
    boxShadow: 3,
  }}
  elevation={6}
  variant="filled"
>
  {snackbar.message}
</MuiAlert>

</Snackbar>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group autocomplete">
                <label>Supplier ID:</label>
                <input
                  type="text"
                  name="supplierId"
                  value={deliveryData.supplierId}
                  onChange={handleInputChange}
                  autoComplete="off"
                  required
                />
                {filteredSuggestions.length > 0 && (
                  <ul className="suggestions-list">
                    {filteredSuggestions.map((supplier) => (
                      <li
                        key={supplier.supplierId}
                        onClick={() => {
                          setDeliveryData(prev => ({
                            ...prev,
                            supplierId: supplier.supplierId
                          }));
                          setSelectedSupplier(supplier);
                          setFilteredSuggestions([]);
                        }}
                      >
                        {supplier.supplierId} - {supplier.supplierName}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="form-group">
                <label>Date:</label>
                <input type="date" name="date" value={deliveryData.date} readOnly disabled />
              </div>

              <div className="form-group">
                <label>Transport:</label>
                <select
                  name="transport"
                  value={deliveryData.transport}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Transport</option>
                  {driverOptions.map((driver) => (
                    <option key={driver.driverId} value={driver.driverId}>
                      {driver.driverName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Route:</label>
                <select
                  name="route"
                  value={deliveryData.route}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Route</option>
                  {routeOptions.map((route) => (
                    <option key={route.delivery_routeId} value={route.delivery_routeName}>
                      {route.delivery_routeName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Total Weight (kg):</label>
                <input type="number" name="totalWeight" value={deliveryData.totalWeight} onChange={handleInputChange} required />
              </div>

              <div className="total-deductions">
                <h5>Deductions</h5>
                <div className="form-group">
                  <label>Total Sack Weight (kg):</label>
                  <input type="number" name="totalSackWeight" value={deliveryData.totalSackWeight} onChange={handleInputChange} required />
                </div>

                <div className="form-group">
                  <label>For Water (kg):</label>
                  <input type="number" name="forWater" value={deliveryData.forWater} onChange={handleInputChange} required />
                </div>

                <div className="form-group">
                  <label>For Withered Leaves (kg):</label>
                  <input type="number" name="forWitheredLeaves" value={deliveryData.forWitheredLeaves} onChange={handleInputChange} required />
                </div>

                <div className="form-group">
                  <label>For Ripe Leaves (kg):</label>
                  <input type="number" name="forRipeLeaves" value={deliveryData.forRipeLeaves} onChange={handleInputChange} required />
                </div> 

                <label>Total Deductions: {totalDeductions.toFixed(2)} kg</label>
              </div>

              <div className="tea-leaves-weights">
                <h5>Tea Leaves Weights: </h5>
                <div className="form-group">
                  <label>Randalu (kg):</label>
                  <input type="number" name="randalu" value={deliveryData.randalu} onChange={handleInputChange} required />
                </div>

                <div className="form-group">
                  <label>Green Tea Leaves (kg):</label>
                  <input type="number" name="greenTeaLeaves" value={deliveryData.greenTeaLeaves} onChange={handleInputChange} readOnly />
                </div>
              </div>
            </div>

            <div className="form-buttons">
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
              <button type="button" className="cancel-btn" onClick={() => navigate("/view-delivery-records")} disabled={isSubmitting}>
                Cancel
              </button>
            </div>
          </form>

          <div className="cards-container">
            {selectedSupplier && (
              <div className="supplier-card">
                <h4>Supplier Details</h4>
                <p><strong>ID:</strong> {selectedSupplier.supplierId}</p>
                <p><strong>Name:</strong> {selectedSupplier.supplierName}</p>
                <p><strong>Contact:</strong> {selectedSupplier.supplierContactNumber}</p>
                <h5>Land Details:</h5>
                {selectedSupplier.landDetails && selectedSupplier.landDetails.length > 0 ? (
                  <ul>
                    {selectedSupplier.landDetails.map((land, idx) => (
                      <li key={idx}>
                        <h6>Land No. {idx + 1}</h6>
                        <p><strong>Address:</strong> {land.landAddress}<br />
                          <strong>Size:</strong> {land.landSize} acres</p>
                        <hr />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No land details available.</p>
                )}
              </div>
            )}

            {selectedDriver && (
              <div className="driver-card">
                <h4>Driver Details</h4>
                <p><strong>ID:</strong> {selectedDriver.driverId}</p>
                <p><strong>Name:</strong> {selectedDriver.driverName}</p>
                <p><strong>Contact:</strong> {selectedDriver.driverContactNumber}</p>
                <h5>Vehicle Details:</h5>
                {selectedDriver.vehicleDetails && selectedDriver.vehicleDetails.length > 0 ? (
                  <ul>
                    {selectedDriver.vehicleDetails.map((vehicle, idx) => (
                      <li key={idx}>
                        <h6>Vehicle No. {idx + 1}</h6>
                        <p><strong>Vehicle Number:</strong> {vehicle.vehicleNumber}<br />
                          <strong>Vehicle Type:</strong> {vehicle.vehicleType} acres</p>
                        <hr />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No vehicle details available.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default AddNewDeliveryRecord;