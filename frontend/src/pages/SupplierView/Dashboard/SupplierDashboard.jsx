import React, { useEffect, useState } from "react";
import SupplierLayout from "../../../components/Supplier/SupplierLayout/SupplierLayout";
import { useAuth } from "../../../contexts/AuthContext";
import axios from "axios";

const SupplierDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/supplier/profile', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setProfile(response.data);
      } catch (err) {
        console.error('Failed to fetch profile', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  return (
    <SupplierLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Supplier Dashboard</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : profile ? (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Supplier ID:</p>
                <p className="font-medium">{profile.supplierId}</p>
              </div>
              <div>
                <p className="text-gray-600">Name:</p>
                <p className="font-medium">{profile.supplierName}</p>
              </div>
              <div>
                <p className="text-gray-600">Contact Number:</p>
                <p className="font-medium">{profile.supplierContactNumber}</p>
              </div>
              <div>
                <p className="text-gray-600">Email:</p>
                <p className="font-medium">{profile.supplierEmail}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-600">Registered Date:</p>
                <p className="font-medium">
                  {new Date(profile.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Add additional dashboard sections here */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Recent Deliveries</h2>
          {/* Delivery history component would go here */}
        </div>
      </div>
    </SupplierLayout>
  );
};

export default SupplierDashboard;