import React, { useState, useEffect } from 'react';
import DriverLayout from "../../../components/Supplier/SupplierLayout/SupplierLayout";
import './DriverNotices.css';

const DriverNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        // Get user role from local storage
        const userRole = localStorage.getItem('userRole');
        
        if (!userRole) {
          setError('User role not found. Please log in again.');
          setLoading(false);
          return;
        }
        
        // Transform user role to match recipient type format if needed
        // For example, if localStorage has "ROLE_DRIVER" but API expects "driver"
        const recipientType = userRole.toLowerCase().replace('role_', '');
        
        // Fetch notices filtered by user's role
        const response = await fetch(`http://localhost:3001/api/notices?recipientType=${recipientType}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch notices');
        }
        
        const data = await response.json();
        setNotices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotices();
  }, []);
  
  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'No expiry';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Function to determine badge color based on priority
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return 'priority-medium';
    }
  };

  if (loading) {
    return <div className="notices-loading">Loading notices...</div>;
  }

  if (error) {
    return <div className="notices-error">Error: {error}</div>;
  }

  if (notices.length === 0) {
    return <div className="no-notices">No notices available for you at this time.</div>;
  }

  return (
    <DriverLayout>
    <div className="user-notices-container">
      <h2>Your Notices</h2>
      <div className="notices-list">
        {notices.map(notice => (
          <div key={notice.id} className="notice-card">
            <div className="notice-header">
              <h3>{notice.title}</h3>
              <span className={`priority-badge ${getPriorityClass(notice.priority)}`}>
                {notice.priority}
              </span>
            </div>
            <div className="notice-content">
              <p>{notice.content}</p>
            </div>
            <div className="notice-footer">
              <span className="notice-date">Posted: {formatDate(notice.created_at)}</span>
              {notice.expiry_date && (
                <span className="notice-expiry">Expires: {formatDate(notice.expiry_date)}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  </DriverLayout>
  );
};

export default DriverNotices;