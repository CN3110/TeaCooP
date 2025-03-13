import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EmployeeLayout from "../../../components/EmployeeLayout/EmployeeLayout";
import "./EditLot.css"; // Add custom styles if needed

const EditLot = () => {
  const { lotNumber } = useParams(); // Get the lotNumber from the URL
  const navigate = useNavigate();

  // State to store the lot data
  const [lotData, setLotData] = useState({
    lotNumber: "",
    invoiceNumber: "",
    manufacturingDate: "",
    teaGrade: "",
    noOfBags: "",
    netWeight: "",
    totalNetWeight: "",
    valuationPrice: "",
  });

  // Fetch the lot data when the component mounts
  useEffect(() => {
    const fetchLot = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/lots/${lotNumber}`);
        if (!response.ok) {
          throw new Error("Failed to fetch lot data");
        }
        const data = await response.json();
        setLotData(data); // Set the fetched data to state
      } catch (error) {
        console.error("Error fetching lot data:", error);
        alert("Failed to fetch lot data. Please try again.");
      }
    };

    fetchLot();
  }, [lotNumber]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLotData({ ...lotData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !lotData.lotNumber ||
      !lotData.invoiceNumber ||
      !lotData.manufacturingDate ||
      !lotData.teaGrade ||
      !lotData.noOfBags ||
      !lotData.netWeight ||
      !lotData.totalNetWeight ||
      !lotData.valuationPrice
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/lots/${lotNumber}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lotData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update lot");
      }

      alert("Lot updated successfully!");
      navigate("/view-lots"); // Navigate back to the lot list page
    } catch (error) {
      console.error("Error updating lot:", error);
      alert("An error occurred while updating the lot: " + error.message);
    }
  };

  return (
    <EmployeeLayout>
      <div className="edit-lot-container">
        <h2>Edit Lot</h2>
        <form className="edit-lot-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Lot Number:</label>
              <input
                type="text"
                name="lotNumber"
                value={lotData.lotNumber}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Invoice Number:</label>
              <input
                type="text"
                name="invoiceNumber"
                value={lotData.invoiceNumber}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Manufacturing Date:</label>
              <input
                type="date"
                name="manufacturingDate"
                value={lotData.manufacturingDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Tea Grade:</label>
              <select
                name="teaGrade"
                value={lotData.teaGrade}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Grade</option>
                <option value="BOP">BOP</option>
                <option value="BOPF">BOPF</option>
                <option value="OP">OP</option>
                <option value="FBOP">FBOP</option>
                <option value="Pekoe">Pekoe</option>
              </select>
            </div>

            <div className="form-group">
              <label>No. of Bags:</label>
              <input
                type="number"
                name="noOfBags"
                value={lotData.noOfBags}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label>Net Weight (kg):</label>
              <input
                type="number"
                name="netWeight"
                value={lotData.netWeight}
                onChange={handleInputChange}
                min="0.01"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label>Total Net Weight (kg):</label>
              <input
                type="number"
                name="totalNetWeight"
                value={lotData.totalNetWeight}
                onChange={handleInputChange}
                min="0.01"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label>Valuation Price (LKR):</label>
              <input
                type="number"
                name="valuationPrice"
                value={lotData.valuationPrice}
                onChange={handleInputChange}
                min="0.01"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="form-buttons">
            <button type="submit" className="submit-button">
              Update Lot
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/view-lots")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </EmployeeLayout>
  );
};

export default EditLot;