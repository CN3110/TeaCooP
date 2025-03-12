import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeLayout from "../../../components/EmployeeLayout/EmployeeLayout";
import DatePicker from 'react-datepicker'; // Date picker library
import 'react-datepicker/dist/react-datepicker.css'; // Date picker styles
import './CreateLot.css'; // Import your custom styles

const CreateLot = () => {
  const [lotData, setLotData] = useState({
    lotNumber: '',
    invoiceNumber: '',
    manufacturingDate: new Date(),
    teaGrade: '',
    noOfBags: '',
    netWeight: '',
    totalNetWeight: '',
    valuationPrice: '',
  });

  const navigate = useNavigate();

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLotData({ ...lotData, [name]: value });
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

    const requestBody = {
      lotNumber: lotData.lotNumber,
      invoiceNumber: lotData.invoiceNumber,
      manufacturingDate: lotData.manufacturingDate,
      teaGrade: lotData.teaGrade,
      noOfBags: lotData.noOfBags,
      netWeight: lotData.netWeight,
      totalNetWeight: lotData.totalNetWeight,
      valuationPrice: lotData.valuationPrice,
    };

    try {
      const response = await fetch("http://localhost:3001/api/lots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        alert("Lot added successfully!");
        navigate("/view-lots"); // Redirect to the view lots page
      } else {
        const errorData = await response.json();
        alert(`Error adding Lot: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error adding Lot:", error);
      alert("An error occurred while adding the Lot.");
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
                <option value="Grade 1">Grade 1</option>
                <option value="Grade 2">Grade 2</option>
                <option value="Grade 3">Grade 3</option>
                <option value="Grade 4">Grade 4</option>
              </select>
            </div>

            <div className="lot-form-group">
              <label>Number of Bags:</label>
              <input
                type="number"
                name="noOfBags"
                value={lotData.noOfBags}
                onChange={handleInputChange}
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
                required
              />
            </div>

            <div className="lot-form-group">
              <label>Total Net Weight (kg):</label>
              <input
                type="number"
                name="totalNetWeight"
                value={lotData.totalNetWeight}
                onChange={handleInputChange}
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