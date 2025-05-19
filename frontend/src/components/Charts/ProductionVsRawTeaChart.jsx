import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';

const ProductionVsRawTeaChart = ({ data }) => {
  // Format the data to strip time from the date
  const chartData = data
    ? data.map(item => ({
        date: new Date(item.date).toISOString().split('T')[0], // format: YYYY-MM-DD
        rawTeaWeight: item.rawTeaWeight || 0,
        teaProduced: item.teaProduced || 0,
      }))
    : [];

  // Date formatter for display (e.g., 19 May)
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
    });
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4">Tea Production vs Raw Tea Over the Date</h2>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={formatDate} />
            <YAxis domain={[0, 10000]} tickCount={11} />
            <Tooltip labelFormatter={formatDate} />
            <Legend />
            <Line
              type="monotone"
              dataKey="rawTeaWeight"
              stroke="#82ca9d"
              name="Raw Tea Weight (kg)"
              dot={false}
              activeDot={{ r: 8 }}
              strokeWidth={4}
            />
            <Line
              type="monotone"
              dataKey="teaProduced"
              stroke="#8884d8"
              name="Production Weight (kg)"
              dot={false}
              strokeWidth={4}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No data available for the selected period
        </div>
      )}
    </div>
  );
};

export default ProductionVsRawTeaChart;
