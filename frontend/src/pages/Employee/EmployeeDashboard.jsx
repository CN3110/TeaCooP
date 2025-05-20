import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardSummaryCards from '../../components/Charts/DashboardSummaryCards';
import ProductionVsRawTeaChart from '../../components/Charts/ProductionVsRawTeaChart';
import SoldLotChart from '../../components/Charts/SoldLotChart';
import AvailableTeaTypeStockChart from '../../components/Charts/AvailableTeaTypeStockChart';
import EmployeeLayout from '../../components/EmployeeLayout/EmployeeLayout';

import ChartCard from '../../components/Charts/ChartCard';

const EmployeeDashboard = () => {
  const [summary, setSummary] = useState({
    suppliers: 0,
    drivers: 0,
    brokers: 0,
    employees: 0
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch data in parallel
        const [countsResponse, productionResponse] = await Promise.all([
          axios.get('http://localhost:3001/api/charts/counts'),
          axios.get('http://localhost:3001/api/charts/production-vs-raw-tea')
        ]);
        
        setSummary(countsResponse.data);
        setChartData(productionResponse.data || []);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <EmployeeLayout>
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Dashboard</h1>
           
          </div>
          
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <DashboardSummaryCards summary={summary} />

            {/* Chart Grid - 2x2 Layout */}
            
              {/* First Row */}
              <ChartCard>
                <ProductionVsRawTeaChart data={chartData} />
              </ChartCard>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard>
                <SoldLotChart />
              </ChartCard>
              
              {/* Second Row */}
              <ChartCard>
                <AvailableTeaTypeStockChart />
              </ChartCard>
              
            </div>
          </>
        )}
      </div>
    </div>
    </EmployeeLayout>
  );
};

export default EmployeeDashboard;