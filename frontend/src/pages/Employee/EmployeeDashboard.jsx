import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EmployeeLayout from '../../components/EmployeeLayout/EmployeeLayout'; 
import ProductionVsRawTeaChart from '../../components/Charts/ProductionVsRawTeaChart'; 
import SoldLotChart from '../../components/Charts/SoldLotChart';

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
        <h1 className="text-3xl font-bold mb-6">Employee Dashboard</h1>
        
        {!loading && (
  <>
    {/* <DashboardCards summary={summary} /> */}
    <ProductionVsRawTeaChart data={chartData} />
    <SoldLotChart/> 
  </>
)}
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeDashboard;