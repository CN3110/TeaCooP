
import React from 'react';

const ChartCard = ({ title, children, height = "h-72" }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden">
    <div className="p-4">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">{title}</h2>
      <div className={`${height} w-full`}>
        {children}
      </div>
    </div>
  </div>
);

export default ChartCard;