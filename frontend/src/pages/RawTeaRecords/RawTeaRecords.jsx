import React, { useEffect, useState } from 'react';
import { TextField, Button } from '@mui/material';
import './RawTeaRecords.css'; // optional for styling

const RawTeaRecords = () => {
  const [rawTeaRecords, setRawTeaRecords] = useState([]);
  const [totalRawTea, setTotalRawTea] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchRecords = async () => {
    try {
      let url = 'http://localhost:3001/api/raw-tea-records';
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      setRawTeaRecords(data);

      const total = data.reduce((sum, record) => sum + parseFloat(record.rawTeaWeight), 0);
      setTotalRawTea(total.toFixed(2));
    } catch (err) {
      console.error('Error fetching raw tea records:', err);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleFilter = () => {
    fetchRecords();
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    fetchRecords();
  };

  return (
    <div className="raw-tea-records-container">
      <h2>Raw Tea Records</h2>

      <div className="filter-section">
        <TextField
          type="date"
          label="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          type="date"
          label="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <Button variant="contained" onClick={handleFilter}>Filter</Button>
        <Button variant="outlined" onClick={handleReset}>Reset</Button>
      </div>

      <div className="total-raw-tea">
        <h3>Total Raw Tea Collected: {totalRawTea} kg</h3>
      </div>

      <table className="records-table">
        <thead>
          <tr>
            <th>Delivery ID</th>
            <th>Date</th>
            <th>Raw Tea Weight (kg)</th>
          </tr>
        </thead>
        <tbody>
          {rawTeaRecords.map((record) => (
            <tr key={record.deliveryId}>
              <td>{record.deliveryId}</td>
              <td>{record.date}</td>
              <td>{parseFloat(record.rawTeaWeight).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RawTeaRecords;
