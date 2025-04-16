import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import EmployeeLayout from '../../../../components/EmployeeLayout/EmployeeLayout';
import './AddNewDeliveryRecord.css';

const AddNewDeliveryRecord = () => {
  const [routeOptions, setRouteOptions] = useState([]);
  const [driverOptions, setDriverOptions] = useState([]);
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

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/deliveryRoutes");
        const data = await response.json();
        setRouteOptions(data);
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    };

    const fetchDrivers = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/drivers"); // Fetch active drivers -not working, for now i fetch all drivers
        
        if (!response.ok) {
          // Handle HTTP errors (404, 500, etc.)
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Debugging log
        console.log("Active drivers response:", data);
        
        // Ensure we have an array before proceeding
        const drivers = Array.isArray(data) ? data : [];
        
        const driverOptionsWithSelf = [
          { driverId: "selfTransport", driverName: "Self Transport" },
          ...drivers
        ];
        
        setDriverOptions(driverOptionsWithSelf);
      } catch (error) {
        console.error("Error fetching drivers:", error);
        // Set default options with just self transport
        setDriverOptions([{ driverId: "selfTransport", driverName: "Self Transport" }]);
      }
    };
    

    fetchRoutes();
    fetchDrivers();
  }, []);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedData = {
      ...deliveryData,
      [name]: value,
    };

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
      alert("Please fill in all required fields.");
      return;
    }

    const date = new Date(deliveryData.date);
    if (isNaN(date.getTime())) {
      alert("Please enter a valid date.");
      return;
    }
    const formattedDate = date.toISOString().split("T")[0];

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

    console.log("Payload being sent:", payload);

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

      const result = await response.json();
      console.log("Response from server:", result);

      alert("Delivery added successfully!");
      setDeliveryData({
        supplierId: "",
        transport: "",
        date: "",
        route: "",
        totalWeight: "",
        totalSackWeight: "",
        forWater: "",
        forWitheredLeaves: "",
        forRipeLeaves: "",
        greenTeaLeaves: "",
        randalu: "",
      });
      navigate("/view-delivery-records");
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while adding the delivery: " + error.message);
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

            <h5>Weights</h5> <br />

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
            </div>

            <div className="form-group">
              <label>Green Tea Leaves (kg):</label>
              <input
                type="number"
                name="greenTeaLeaves"
                value={deliveryData.greenTeaLeaves}
                onChange={handleInputChange}
                readOnly
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
            <button type="button" className="cancel-btn" onClick={() => navigate("/view-delivery-records")}>Cancel</button>
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

        trasport menu : shold get drivers from the database that have been added to the system
        route menu : should get routes are the hardcorded routes in the system

        alternative : (if the user enter supplierId that is not in the database, the user should be notified that the supplierId is not in the database )
                      when the user enter the begining of the supplierId, the system should suggest the supplierId that is in the database

*/