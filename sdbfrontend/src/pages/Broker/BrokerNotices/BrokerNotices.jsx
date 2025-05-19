import React, { useState, useEffect } from 'react';
import BrokerLayout from "../../../components/broker/BrokerLayout/BrokerLayout";
import './BrokerNotices.css';

const BrokerNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const userRole = localStorage.getItem('userRole');
        
        if (!userRole) {
          setError('User role not found. Please log in again.');
          setLoading(false);
          return;
        }
        
        const recipientType = userRole.toLowerCase().replace('role_', '');
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
  
  const formatDate = (dateString) => {
    if (!dateString) return 'No expiry';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
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
    return (
      <BrokerLayout>
        <div className="notices-loading">Loading notices...</div>
      </BrokerLayout>
    );
  }

  if (error) {
    return (
      <BrokerLayout>
        <div className="notices-error">Error: {error}</div>
      </BrokerLayout>
    );
  }

  if (notices.length === 0) {
    return (
      <BrokerLayout>
        <div className="no-notices">No notices available for you at this time.</div>
      </BrokerLayout>
    );
  }

  return (
    <BrokerLayout>
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
    </BrokerLayout>
  );
};

export default BrokerNotices;