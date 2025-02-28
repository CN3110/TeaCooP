import React, { useState } from 'react';
import EmployeeLayout from '../../../../components/EmployeeLayout/EmployeeLayout';
import './AddNewDeliveryRecord.css';

const AddNewDeliveryRecord = () => {
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

  const transportOptions = [
    { value: 'selfTransport', label: 'Self Transport' },
    { value: 'D001', label: 'D001' },
    { value: 'D002', label: 'D002' },
    { value: 'D003', label: 'D003' },
    { value: 'D004', label: 'D004' }
  ];

  const routeOptions = [
    { value: 'route1', label: 'Route 1' },
    { value: 'route2', label: 'Route 2' },
    { value: 'route3', label: 'Route 3' },
    { value: 'route4', label: 'Route 4' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedData = {
      ...deliveryData,
      [name]: value,
    };

    // Recalculate GreenTeaLeaves if any of the dependent fields change
    if (
      name === 'totalWeight' ||
      name === 'totalSackWeight' ||
      name === 'forWater' ||
      name === 'forWitheredLeaves' ||
      name === 'forRipeLeaves' ||
      name === 'randalu'
    ) {
      const totalWeight = parseFloat(updatedData.totalWeight) || 0;
      const totalSackWeight = parseFloat(updatedData.totalSackWeight) || 0;
      const forWater = parseFloat(updatedData.forWater) || 0;
      const forWitheredLeaves = parseFloat(updatedData.forWitheredLeaves) || 0;
      const forRipeLeaves = parseFloat(updatedData.forRipeLeaves) || 0;
      const randalu = parseFloat(updatedData.randalu) || 0;

      const greenTeaLeaves =
        totalWeight - totalSackWeight - forWater - forWitheredLeaves - forRipeLeaves - randalu;

      updatedData.greenTeaLeaves = greenTeaLeaves >= 0 ? greenTeaLeaves.toFixed(2) : 0;
    }

    setDeliveryData(updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate required fields
    if (
      !deliveryData.supplierId ||
      !deliveryData.transport ||
      !deliveryData.date ||
      !deliveryData.route ||
      !deliveryData.totalWeight ||
      !deliveryData.totalSackWeight ||
      !deliveryData.forWater ||
      !deliveryData.forWitheredLeaves ||
      !deliveryData.forRipeLeaves ||
      !deliveryData.greenTeaLeaves ||
      !deliveryData.randalu
    ) {
      alert('Please fill in all required fields.');
      return;
    }
  
    // Convert date from mm/dd/yyyy to YYYY-MM-DD
    const date = new Date(deliveryData.date);
    if (isNaN(date.getTime())) {
      alert('Please enter a valid date.');
      return;
    }
    const formattedDate = date.toISOString().split('T')[0];
  
    // Create the payload with the formatted date and parsed numeric fields
    const payload = {
      ...deliveryData,
      date: formattedDate,
      totalWeight: parseFloat(deliveryData.totalWeight),
      totalSackWeight: parseFloat(deliveryData.totalSackWeight),
      forWater: parseFloat(deliveryData.forWater),
      forWitheredLeaves: parseFloat(deliveryData.forWitheredLeaves),
      forRipeLeaves: parseFloat(deliveryData.forRipeLeaves),
      greenTeaLeaves: parseFloat(deliveryData.greenTeaLeaves),
      randalu: parseFloat(deliveryData.randalu),
    };
  
    console.log("Payload being sent:", payload); // Log the payload
  
    try {
      const response = await fetch('http://localhost:3001/api/deliveries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const result = await response.json();
      console.log("Response from server:", result);
  
      if (response.ok) {
        alert('Delivery added successfully!');
        // Optionally, reset the form
        setDeliveryData({
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
      } else {
        alert('Failed to add delivery: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding the delivery');
    }
  };

  return (
    <EmployeeLayout>
      <div className='add-new-delivery'>
        <h3>Add New Tea Delivery</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Supplier ID:</label>
              <input
                type="text"
                name="supplierId"
                value={deliveryData.supplierId}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Date:</label>
              <input
                type="date"
                name="date"
                value={deliveryData.date}
                onChange={handleInputChange}
                required
              />
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
                {transportOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
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
                {routeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <h5>Weights</h5> <br></br>

            <div className="form-group">
              <label>Total Weight (kg):</label>
              <input
                type="number"
                name="totalWeight"
                value={deliveryData.totalWeight}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Total Sack Weight (kg):</label>
              <input
                type="number"
                name="totalSackWeight"
                value={deliveryData.totalSackWeight}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>For Water (kg):</label>
              <input
                type="number"
                name="forWater"
                value={deliveryData.forWater}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>For Withered Leaves (kg):</label>
              <input
                type="number"
                name="forWitheredLeaves"
                value={deliveryData.forWitheredLeaves}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>For Ripe Leaves (kg):</label>
              <input
                type="number"
                name="forRipeLeaves"
                value={deliveryData.forRipeLeaves}
                onChange={handleInputChange}
                required
              />
            </div> <br></br>

            <div className="form-group">
              <label>Green Tea Leaves (kg):</label>
              <input
                type="number"
                name="greenTeaLeaves"
                value={deliveryData.greenTeaLeaves}
                onChange={handleInputChange}
                readOnly // Make the field read-only
              />
            </div>

            <div className="form-group">
              <label>Randalu (kg):</label>
              <input
                type="number"
                name="randalu"
                value={deliveryData.randalu}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-buttons">
            <button type="submit" className="submit-btn">Submit</button>
            <button type="button" className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </EmployeeLayout>
  );
};

export default AddNewDeliveryRecord;


/* considerations in the code
        weights should be numbers - done
        weights should not be negative
        weights can be zero (can: totalSackWeight, forWater, forWitheredLeaves, forRipeLeaves, randalu)
                            (cannot: totalWeight, greenTeaLeaves) they should be  > 0
        date should not be in the future (should be today)

        alternative : (if the user enter supplierId that is not in the database, the user should be notified that the supplierId is not in the database )
                      when the user enter the begining of the supplierId, the system should suggest the supplierId that is in the database

*/