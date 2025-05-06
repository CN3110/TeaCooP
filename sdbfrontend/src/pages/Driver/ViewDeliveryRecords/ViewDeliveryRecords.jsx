import React, { useEffect, useState } from "react";
import DriverLayout from "../../../components/driver/DriverLayout/DriverLayout";
import { BiSearch } from "react-icons/bi";
import "./ViewDeliveryRecords.css";
import axios from "axios";

const ViewDeliveryRecords = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [loading, setLoading] = useState(true);

  const driverId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        if (!driverId) {
          console.error("No driver ID found in localStorage");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:3001/api/deliveries/by-driver?driverId=${driverId}`
        );
        setDeliveries(response.data);
      } catch (error) {
        console.error("Error fetching deliveries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, [driverId]);

  const filteredDeliveries = deliveries.filter((delivery) => {
    if (!searchDate) return true;
    const deliveryDate = new Date(delivery.date).toISOString().split("T")[0];
    return deliveryDate === searchDate;
  });

  return (
    <DriverLayout>
      <div className="driver-delivery-history">
        <h3>My Delivery Assignments</h3>

        <div className="search-box">
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />
          <BiSearch className="icon" />
        </div>

        {loading ? (
          <p>Loading deliveries...</p>
        ) : (
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
                    <td>{new Date(delivery.date).toLocaleDateString()}</td>
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
        )}
      </div>
    </DriverLayout>
  );
};

export default ViewDeliveryRecords;
