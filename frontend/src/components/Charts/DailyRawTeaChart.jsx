import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';

const DailyRawTeaChart = ({ data }) => {
  // Safely format the data
  const chartData = data
    ? data.map(item => {
        // Safely parse the date
        let dateStr = item.date;
        let formattedDate = dateStr;
        
        try {
          // If it's already in YYYY-MM-DD format, use as is
          if (typeof dateStr === 'string' && dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
            formattedDate = dateStr;
          } else {
            // Otherwise, try to parse it
            const dateObj = new Date(dateStr);
            if (!isNaN(dateObj.getTime())) {
              formattedDate = dateObj.toISOString().split('T')[0];
            }
          }
        } catch (e) {
          console.warn('Invalid date format:', dateStr);
          formattedDate = 'Invalid Date';
        }

        return {
          date: formattedDate,
          rawTeaWeight: item.rawTeaWeight || 0
        };
      })
      // Filter out invalid dates
      .filter(item => item.date !== 'Invalid Date')
    : [];

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr; // Return original if invalid
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4">Daily Raw Tea Delivery</h2>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={formatDate} />
            <YAxis domain={[0, 'dataMax + 1000']} />
            <Tooltip labelFormatter={formatDate} />
            <Legend />
            <Bar
              dataKey="rawTeaWeight"
              fill="#8884d8"
              name="Raw Tea Weight (kg)"
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center py-8 text-gray-500">
          {data ? 'No valid data available' : 'No data loaded'}
        </div>
      )}
    </div>
  );
};

export default DailyRawTeaChart;