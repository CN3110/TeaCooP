import React, { useEffect, useState } from "react";
import DriverLayout from "../../../components/Driver/DriverLayout/DriverLayout";
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
        <h3>My Delivery Records</h3>

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
                <th>Raw Tea Weight</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeliveries.length > 0 ? (
                filteredDeliveries.map((delivery, index) => {
                  const rawTeaWeight =
                    (parseFloat(delivery.randalu) || 0) +
                    (parseFloat(delivery.greenTeaLeaves) || 0);

                  return (
                    <tr key={index}>
                      <td>{new Date(delivery.date).toLocaleDateString()}</td>
                      <td>{delivery.supplierId}</td>
                      <td>{delivery.route}</td>
                      <td>{rawTeaWeight.toFixed(2)} kg</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4">No delivery records found.</td>
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
