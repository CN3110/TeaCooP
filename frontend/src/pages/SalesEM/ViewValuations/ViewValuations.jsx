import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EmployeeLayout from "../../../components/EmployeeLayout/EmployeeLayout";

const ViewValuations = () => {
  const { lotNumber } = useParams();
  const [valuations, setValuations] = useState([]);
  const [loading, setLoading] = useState(true);  // Loading state for fetching data
  const [error, setError] = useState(null); // To catch any fetch errors
  const navigate = useNavigate();

  useEffect(() => {
    const fetchValuations = async () => {
      try {
        setLoading(true);  // Start loading
        const res = await fetch(`http://localhost:3001/api/valuations/lot/${lotNumber}`);
        if (!res.ok) throw new Error("Failed to fetch valuations"); // Handle non-OK response
        const data = await res.json();
        setValuations(data); // Set the fetched data
      } catch (error) {
        setError(error.message);  // Set the error state
        console.error("Failed to fetch valuations:", error);
      } finally {
        setLoading(false);  // Stop loading
      }
    };

    fetchValuations();
  }, [lotNumber]);

  const handleConfirm = async (valuationId) => {
    try {
      const employeeId = localStorage.getItem("employeeId") || 1; // assuming login
      const res = await fetch(`http://localhost:3001/api/valuations/${valuationId}/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ employeeId }),
      });

      if (!res.ok) throw new Error("Failed to confirm valuation");

      alert("Valuation confirmed!");
      // Reload updated data
      const updated = await fetch(`http://localhost:3001/api/valuations/lot/${lotNumber}`);
      if (!updated.ok) throw new Error("Failed to reload valuations");
      const data = await updated.json();
      setValuations(data); // Update the valuations after confirmation
    } catch (error) {
      console.error("Error confirming valuation:", error);
    }
  };

  if (loading) return <div>Loading...</div>; // Show loading message while fetching
  if (error) return <div>Error: {error}</div>; // Show error message if there's an error

  return (
    <EmployeeLayout>
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
          {valuations.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4">No valuations available for this lot.</td>
            </tr>
          ) : (
            valuations.map((v) => (
              <tr key={v.valuation_id}>
                <td className="border px-4 py-2">{v.brokerId}</td>
                <td className="border px-4 py-2">{v.brokerName}</td>
                <td className="border px-4 py-2">{v.brokerCompanyName}</td>
                <td className="border px-4 py-2">{v.valuationPrice}</td> 
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
            ))
          )}
        </tbody>
      </table>
    </div>
    </EmployeeLayout>
  );
};

export default ViewValuations;
