import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeLayout from "../../../components/EmployeeLayout/EmployeeLayout";
import DatePicker from 'react-datepicker'; // Date picker library
import 'react-datepicker/dist/react-datepicker.css'; // Date picker styles
import './CreateLot.css'; 

const CreateLot = () => {
  const [lotData, setLotData] = useState({
    lotNumber: '',
    invoiceNumber: '',
    manufacturingDate: new Date(), // Initialize with current date
    teaGrade: '',
    noOfBags: '',
    netWeight: '',
    totalNetWeight: '',
    valuationPrice: '',
  });

  const teaGradeOptions = [
    { value: 'BOP', label: 'BOP' },
    { value: 'BOPF', label: 'BOPF' },
    { value: 'OP', label: 'OP' },
    { value: 'FBOP', label: 'FBOP' },
    { value: 'Pekoe', label: 'Pekoe' }
  ];

  const navigate = useNavigate();

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedData = {
      ...lotData,
      [name]: value,
    };

    // Calculate totalNetWeight if noOfBags or netWeight changes
    if (name === 'noOfBags' || name === 'netWeight') {
      const noOfBags = name === 'noOfBags' ? parseFloat(value) : parseFloat(lotData.noOfBags);
      const netWeight = name === 'netWeight' ? parseFloat(value) : parseFloat(lotData.netWeight);
      updatedData.totalNetWeight = (noOfBags * netWeight).toFixed(2); // Calculate and round to 2 decimal places
    }

    setLotData(updatedData);
  };

  // Handle date changes
  const handleDateChange = (date) => {
    setLotData({ ...lotData, manufacturingDate: date });
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

    // Validate numeric fields (must be greater than zero)
    if (
      parseFloat(lotData.noOfBags) <= 0 ||
      parseFloat(lotData.netWeight) <= 0 ||
      parseFloat(lotData.totalNetWeight) <= 0 ||
      parseFloat(lotData.valuationPrice) <= 0
    ) {
      alert("All numeric fields must be greater than zero.");
      return;
    }

    // Format the date as YYYY-MM-DD
    const formattedDate = new Date(lotData.manufacturingDate).toISOString().split('T')[0];

    const payload = {
      ...lotData,
      manufacturingDate: formattedDate,
      noOfBags: parseFloat(lotData.noOfBags),
      netWeight: parseFloat(lotData.netWeight),
      totalNetWeight: parseFloat(lotData.totalNetWeight),
      valuationPrice: parseFloat(lotData.valuationPrice),
    };

    console.log("Payload being sent:", payload); // Log the payload

    try {
      const response = await fetch("http://localhost:3001/api/lots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add lot");
      }

      const result = await response.json();
      console.log("Response from server:", result);

      alert("Lot added successfully!");

      // Reset the form
      setLotData({
        lotNumber: "",
        invoiceNumber: "",
        manufacturingDate: new Date(),
        teaGrade: "",
        noOfBags: "",
        netWeight: "",
        totalNetWeight: "",
        valuationPrice: "",
      });

    } catch (error) {
      console.error("Error adding Lot:", error);
      alert("An error occurred while adding the Lot: " + error.message);
    }
  };

  return (
    <EmployeeLayout>
      <div className="create-lot-container">
        <h2>Create Lot</h2>
        <form className="lot-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="lot-form-group">
              <label>Lot Number:</label>
              <input
                type="text"
                name="lotNumber"
                value={lotData.lotNumber}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="lot-form-group">
              <label>Invoice Number:</label>
              <input
                type="text"
                name="invoiceNumber"
                value={lotData.invoiceNumber}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="lot-form-group">
              <label>Grade:</label>
              <select
                name="teaGrade"
                value={lotData.teaGrade}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Grade</option>
                {teaGradeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="lot-form-group">
              <label>Number of Bags:</label>
              <input
                type="number"
                name="noOfBags"
                value={lotData.noOfBags}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>

            <div className="lot-form-group">
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

            <div className="lot-form-group">
              <label>Total Net Weight (kg):</label>
              <input
                type="number"
                name="totalNetWeight"
                value={lotData.totalNetWeight}
                readOnly // Make it read-only since it's calculated
                required
              />
            </div>

            <div className="lot-form-group">
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

            <div className="lot-form-group">
              <label>Date of Manufacture:</label>
              <DatePicker
                selected={lotData.manufacturingDate}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                required
              />
            </div>
          </div>

          <div className="form-buttons">
            <button type="submit" className="submit-button">
              Add Lot
            </button>

            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/view-lots")} // Redirect to the view lots page
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </EmployeeLayout>
  );
};

export default CreateLot;