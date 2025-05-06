import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './TeaProductionSummary.css'; // Assuming you have a CSS file for styling

const TeaProductionSummary = () => {
  const [summaryData, setSummaryData] = useState({
    rawTeaTotal: 0,
    madeTeaTotal: 0,
    fibreTotal: 0,
    teaTypeProduction: [],
    teaTypeStock: [],
    totalPackets: 0,
    totalLotWeight: 0
  });
  
  const [filterDate, setFilterDate] = useState(new Date());
  
  useEffect(() => {
    fetchSummaryData(filterDate);
  }, [filterDate]);
  
  // Update the fetchSummaryData function
const fetchSummaryData = async (date) => {
  try {
    const formattedDate = format(date, 'yyyy-MM');
    
    const rawTeaResponse = await fetch(`http://localhost:3001/api/deliveries/summary?month=${formattedDate}`);
    const rawTeaData = await rawTeaResponse.json();
    
    const madeTeaResponse = await fetch(`http://localhost:3001/api/production/summary?month=${formattedDate}`);
    const madeTeaData = await madeTeaResponse.json();
    
    const teaTypeResponse = await fetch(`http://localhost:3001/api/lots/summary?month=${formattedDate}`);
    const teaTypeData = await teaTypeResponse.json();
    
    setSummaryData({
      rawTeaTotal: rawTeaData.totalRawTea || 0,
      madeTeaTotal: madeTeaData.totalMadeTea || 0,
      fibreTotal: madeTeaData.totalFibre || 0,
      teaTypeProduction: teaTypeData.production || [],
      teaTypeStock: teaTypeData.stock || [],
      totalPackets: teaTypeData.totalPackets || 0,
      totalLotWeight: teaTypeData.totalLotWeight || 0
    });
  } catch (error) {
    console.error('Error fetching summary data:', error);
  }
};

  const handleDateChange = (date) => {
    setFilterDate(date);
  };
  
  return (
    <div className="tea-summary-container">
      <div className="summary-header">
        <h2>Tea Production Summary</h2>
        <div className="filter-container">
          <DatePicker
            selected={filterDate}
            onChange={handleDateChange}
            dateFormat="MMMM yyyy"
            showMonthYearPicker
            className="date-filter"
          />
          <button className="filter-button">Filter by month, year</button>
        </div>
      </div>
      
      <div className="summary-cards">
        <div className="summary-card">
          <h3>Raw tea Total of</h3>
          <p>{format(filterDate, 'MMMM yyyy').toUpperCase()} : {summaryData.rawTeaTotal}kg</p>
          <button className="view-more">Viewmore...</button>
        </div>
        
        <div className="summary-card">
          <h3>Total Made tea of</h3>
          <p>{format(filterDate, 'MMMM yyyy').toUpperCase()} : {summaryData.madeTeaTotal}kg</p>
          <button className="view-more">Viewmore...</button>
        </div>
        
        <div className="summary-card">
          <h3>Total Fibre of</h3>
          <p>{format(filterDate, 'MMMM yyyy').toUpperCase()} : {summaryData.fibreTotal}kg</p>
          <button className="view-more">Viewmore...</button>
        </div>
        
        <div className="summary-card wide-card">
          <h3>Tea Categorized by tea type ({format(filterDate, 'yyyy MMMM')}) – total production</h3>
          <div className="tea-types">
            {summaryData.teaTypeProduction.map((type, index) => (
              <p key={index}>{type.name} = {type.weight}kg</p>
            ))}
          </div>
        </div>
        
        <div className="summary-card">
          <h3>Total Packets = {summaryData.totalPackets}</h3>
          <button className="view-more">Viewmore...</button>
        </div>
        
        <div className="summary-card wide-card">
          <h3>Tea Categorized by tea type ({format(filterDate, 'yyyy MMMM')}) – current stock</h3>
          <div className="tea-types">
            {summaryData.teaTypeStock.map((type, index) => (
              <p key={index}>{type.name} = {type.weight}kg</p>
            ))}
          </div>
        </div>
        
        <div className="summary-card">
          <h3>Total Lot weights = {summaryData.totalLotWeight}kg</h3>
          <button className="view-more">Viewmore...</button>
        </div>
      </div>
    </div>
  );
};

export default TeaProductionSummary;
