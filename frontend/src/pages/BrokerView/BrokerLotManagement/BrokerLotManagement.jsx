import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BrokerLayout from "../../../components/Broker/BrokerLayout/BrokerLayout";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
//import './BrokerLotManagement.css';

const BrokerLotManagement = () => {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingLot, setEditingLot] = useState(null);
  const [brokerValuation, setBrokerValuation] = useState("");
  const [soldPrice, setSoldPrice] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // Fetch all lots from the server
  useEffect(() => {
    const fetchLots = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/lots");
        if (!response.ok) {
          throw new Error("Failed to fetch lots");
        }
        const data = await response.json();
        setLots(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLots();
  }, []);

  // Handle edit button click
  const handleEdit = (lot) => {
    setEditingLot(lot.lotNumber);
    setBrokerValuation(lot.brokerValuationPrice || "");
    setSoldPrice(lot.soldPrice || "");
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingLot(null);
    setBrokerValuation("");
    setSoldPrice("");
  };

  // Handle save changes
  const handleSave = async (lotNumber) => {
    if (!brokerValuation || parseFloat(brokerValuation) <= 0) {
      alert("Please enter a valid broker valuation price (greater than 0)");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/lots/${lotNumber}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brokerValuationPrice: parseFloat(brokerValuation),
          soldPrice: soldPrice ? parseFloat(soldPrice) : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update lot");
      }

      const updatedLot = await response.json();
      
      // Update the local state with the updated lot
      setLots(lots.map(lot => 
        lot.lotNumber === lotNumber ? updatedLot : lot
      ));

      // Reset editing state
      setEditingLot(null);
      setBrokerValuation("");
      setSoldPrice("");

      alert("Lot updated successfully!");
    } catch (error) {
      console.error("Error updating lot:", error);
      alert("An error occurred while updating the lot: " + error.message);
    }
  };

  // Filter lots based on search term
  const filteredLots = lots.filter(lot => 
    lot.lotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lot.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lot.teaGrade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <BrokerLayout>
      <div className="broker-lot-management-container">
        <h2>Lot Management</h2>
        
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by Lot Number, Invoice, or Grade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="lots-table-container">
          <table className="lots-table">
            <thead>
              <tr>
                <th>Lot Number</th>
                <th>Invoice Number</th>
                <th>Manufacturing Date</th>
                <th>Tea Grade</th>
                <th>No. of Bags</th>
                <th>Net Weight (kg)</th>
                <th>Total Net Weight (kg)</th>
                <th>Employee Valuation (LKR)</th>
                <th>Broker Valuation (LKR)</th>
                <th>Sold Price (LKR)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLots.map((lot) => (
                <tr key={lot.lotNumber}>
                  <td>{lot.lotNumber}</td>
                  <td>{lot.invoiceNumber}</td>
                  <td>{new Date(lot.manufacturingDate).toLocaleDateString()}</td>
                  <td>{lot.teaGrade}</td>
                  <td>{lot.noOfBags}</td>
                  <td>{lot.netWeight}</td>
                  <td>{lot.totalNetWeight}</td>
                  <td>{lot.valuationPrice}</td>
                  
                  {editingLot === lot.lotNumber ? (
                    <>
                      <td>
                        <input
                          type="number"
                          value={brokerValuation}
                          onChange={(e) => setBrokerValuation(e.target.value)}
                          min="0.01"
                          step="0.01"
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={soldPrice}
                          onChange={(e) => setSoldPrice(e.target.value)}
                          min="0.01"
                          step="0.01"
                        />
                      </td>
                      <td className="action-buttons">
                        <button 
                          className="save-button"
                          onClick={() => handleSave(lot.lotNumber)}
                        >
                          Save
                        </button>
                        <button 
                          className="cancel-button"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{lot.brokerValuationPrice || "-"}</td>
                      <td>{lot.soldPrice || "-"}</td>
                      <td>
                        <button 
                          className="edit-button"
                          onClick={() => handleEdit(lot)}
                        >
                          Edit
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </BrokerLayout>
  );
};

export default BrokerLotManagement;