import React, { useEffect, useState } from "react";
import DriverLayout from "../../../components/driver/DriverLayout/DriverLayout"; // Adjust path as needed
import { BiSearch } from "react-icons/bi";
import "./ViewDeliveryRecords.css"; // Ensure this file exists

const ViewDeliveryRecords = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [searchDate, setSearchDate] = useState("");

  const driverId = localStorage.getItem("driverId"); // Example: "D001"

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/deliveries");
        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();

        // Filter deliveries for the specific driver
        const driverDeliveries = data.filter(
          (delivery) => delivery.transport === driverId
        );

        // Sort by date (latest first)
        const sortedDeliveries = driverDeliveries.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setDeliveries(sortedDeliveries);
      } catch (error) {
        console.error("Error fetching deliveries:", error);
      }
    };

    fetchDeliveries();
  }, [driverId]);

  // ✅ Filter deliveries based on the selected search date
  const filteredDeliveries = deliveries.filter((delivery) => {
    if (!searchDate) return true; // Show all if no date is selected

    const deliveryDate = new Date(delivery.date).toISOString().split("T")[0]; // Convert to YYYY-MM-DD format
    return deliveryDate === searchDate;
  });

  return (
    <DriverLayout>
      <div className="driver-delivery-history">
        <h3>My Delivery Assignments</h3>

        <div className="search-box">
          <input
            type="date" // ✅ Change to date picker
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />
          <BiSearch className="icon" />
        </div>

        <table className="deliveries-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Supplier ID</th>
              <th>Route</th>
              <th>Total Weight (kg)</th>
              <th>Total Sack Weight (kg)</th>
              <th>For Water (kg)</th>
              <th>Withered Leaves (kg)</th>
              <th>Ripe Leaves (kg)</th>
              <th>Randalu (kg)</th>
              <th>Green Tea Leaves (kg)</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeliveries.length > 0 ? (
              filteredDeliveries.map((delivery, index) => (
                <tr key={index}>
                  <td>{delivery.date}</td>
                  <td>{delivery.supplierId}</td>
                  <td>{delivery.route}</td>
                  <td>{delivery.totalWeight} kg</td>
                  <td>{delivery.totalSackWeight} kg</td>
                  <td>{delivery.forWater} kg</td>
                  <td>{delivery.forWitheredLeaves} kg</td>
                  <td>{delivery.forRipeLeaves} kg</td>
                  <td>{delivery.randalu} kg</td>
                  <td>{delivery.greenTeaLeaves} kg</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10">No delivery records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DriverLayout>
  );
};

export default ViewDeliveryRecords;
