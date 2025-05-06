import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function TeaProductionChart() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This would normally fetch from your API
    // Simulating data for demonstration purposes
    const fetchData = async () => {
      try {
        // This would be your actual API call
        // const res = await fetch('http://localhost:3001/api/production/monthly');
        // const data = await res.json();
        
        // For now, we'll generate sample data
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const sampleData = months.map((month, index) => {
          const rawTeaAmount = Math.floor(Math.random() * 500) + 800; // Between 800-1300
          return {
            name: month,
            'Raw Tea': rawTeaAmount,
            'Made Tea': Math.floor(rawTeaAmount * (Math.random() * 0.1 + 0.2)), // 20-30% of raw tea
          };
        });
        
        setChartData(sampleData);
      } catch (error) {
        console.error('Error loading chart data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading chart data...</div>;
  }

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">Tea Production Trends</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Raw Tea" stroke="#43a047" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="Made Tea" stroke="#795548" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}