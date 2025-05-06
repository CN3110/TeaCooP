import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ManageBrokerValuations = () => {
  const { lotNumber } = useParams();
  const [valuations, setValuations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchValuations = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/valuations/lot/${lotNumber}`);
        const data = await res.json();
        setValuations(data);
      } catch (error) {
        console.error("Failed to fetch valuations:", error);
      }
    };

    fetchValuations();
  }, [lotNumber]);

  const handleConfirm = async (valuationId) => {
    try {
      // Get employee ID from localStorage
      const employeeId = localStorage.getItem("userId");
      
      if (!employeeId) {
        alert("Employee ID not found. Please log in again.");
        return;
      }
      
      if (isNaN(employeeId)) {
        alert("Invalid employee ID format");
        return;
      }
  
      const res = await fetch(`http://localhost:3001/api/valuations/${valuationId}/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employeeId: parseInt(employeeId) }),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to confirm valuation");
      }
  
      alert("Valuation confirmed!");
      // Reload updated data
      const updated = await fetch(`http://localhost:3001/api/valuations/lot/${lotNumber}`);
      const data = await updated.json();
      setValuations(data);
    } catch (error) {
      console.error("Error confirming valuation:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Valuations for Lot {lotNumber}</h2>
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
      >
        Back
      </button>
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Broker ID</th>
            <th className="border px-4 py-2">Broker Name</th>
            <th className="border px-4 py-2">Company Name</th>
            <th className="border px-4 py-2">Valuation (LKR)</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {valuations.map((v) => (
            <tr key={v.valuation_id}>
              <td className="border px-4 py-2">{v.brokerId}</td>
              <td className="border px-4 py-2">{v.brokerName}</td>
              <td className="border px-4 py-2">{v.companyName}</td>
              <td className="border px-4 py-2">{v.valuationAmount}</td>
              <td className="border px-4 py-2">
                {v.is_confirmed
                  ? "✅ Confirmed"
                  : v.is_rejected
                  ? "❌ Rejected"
                  : "Pending"}
              </td>
              <td className="border px-4 py-2">
                {!v.is_confirmed && !v.is_rejected && (
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    onClick={() => handleConfirm(v.valuation_id)}
                  >
                    Confirm
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageBrokerValuations;