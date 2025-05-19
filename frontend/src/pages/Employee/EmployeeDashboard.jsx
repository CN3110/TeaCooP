import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EmployeeLayout from '../../components/EmployeeLayout/EmployeeLayout'; 
import ProductionVsRawTeaChart from '../../components/Charts/ProductionVsRawTeaChart'; 
import SoldLotChart from '../../components/Charts/SoldLotChart';
import AvailableTeaTypeStockChart from '../../components/Charts/AvailableTeaTypeStockChart';
import DashboardSummaryCards from '../../components/Charts/DashboardSummaryCards';

const EmployeeDashboard = () => {
  const [summary, setSummary] = useState({
    totalDeliveries: 0,
    totalRawTeaWeight: 0,
    totalProduction: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        const productionVsRawTea = await axios.get('http://localhost:3001/api/charts/production-vs-raw-tea');
        const data = productionVsRawTea.data || [];

        const dailySupplierData = await axios.get('http://localhost:3001/api/charts/daily-tea-summary');
        
        // Calculate totals
        const totalWeight = data.reduce((acc, cur) => acc + (cur.rawTeaWeight || 0), 0);
        const totalProd = data.reduce((acc, cur) => acc + (cur.teaProduced || 0), 0);

        setSummary({
          totalDeliveries: data.length,
          totalRawTeaWeight: totalWeight,
          totalProduction: totalProd,
        });

        setChartData(data);
      } catch (err) {
        console.error('Error loading reports:', err);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  return (
    <EmployeeLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Employee Dashboard</h1>
          <p className="text-gray-600 mb-6">Overview of tea production and inventory</p>
          
          {!loading && (
            <>
              {/* Summary Cards - Top Row */}
              <div className="mb-8">
                <DashboardSummaryCards />
              </div>
              
              {/* Charts Grid - 2x2 Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Row */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-700 mb-4">Production vs Raw Tea</h2>
                  <div className="h-80">
                    <ProductionVsRawTeaChart data={chartData} />
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-700 mb-4">Sold Lots</h2>
                  <div className="h-80">
                    <SoldLotChart /> 
                  </div>
                </div>
                
                {/* Second Row */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-700 mb-4">Available Tea Stock</h2>
                  <div className="h-80">
                    <AvailableTeaTypeStockChart />
                  </div>
                </div>
                
                {/* Optional: Add another chart or component here if needed */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-700 mb-4">Performance Metrics</h2>
                  <div className="h-80 flex items-center justify-center text-gray-500">
                    <p>Additional metrics or charts can be added here</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeDashboard;